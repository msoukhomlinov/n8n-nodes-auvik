import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function isoRangeFromPreset(preset: string): { from?: string; to?: string } {
  if (preset && preset !== 'CUSTOM') {
    const { computeDateTimeRangeUtc } = require('../../helpers/options/datePresets');
    return computeDateTimeRangeUtc(preset);
  }
  return {};
}

export async function executePlaybook(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const operation = this.getNodeParameter('operation', 0) as string;

  // 1) Triage Alerts
  if (operation === 'triageAlerts') {
    const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
    const severity = this.getNodeParameter('severity', 0, '') as string;
    const detectedTimePreset = this.getNodeParameter('detectedTimePreset', 0, 'LAST_30_MINUTES') as string;
    let filterDetectedTimeAfter = this.getNodeParameter('filterDetectedTimeAfter', 0, '') as string;
    let filterDetectedTimeBefore = this.getNodeParameter('filterDetectedTimeBefore', 0, '') as string;
    const includeUtilisation = this.getNodeParameter('includeUtilisation', 0, true) as boolean;
    const includeLastConfig = this.getNodeParameter('includeLastConfig', 0, true) as boolean;
    const utilisationPreset = this.getNodeParameter('utilisationPreset', 0, 'LAST_1_HOUR') as string;
    const utilisationWindowHours = this.getNodeParameter('utilisationWindowHours', 0, 24) as number;
    const bulkDismiss = this.getNodeParameter('bulkDismiss', 0, false) as boolean;
    const confirmBulkDismiss = this.getNodeParameter('confirmBulkDismiss', 0, false) as boolean;
    const returnAll = this.getNodeParameter('returnAll', 0, true) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;

    if (detectedTimePreset && detectedTimePreset !== 'CUSTOM') {
      const range = isoRangeFromPreset(detectedTimePreset);
      filterDetectedTimeAfter = range.from || filterDetectedTimeAfter;
      filterDetectedTimeBefore = range.to || filterDetectedTimeBefore;
    }

    const qs: IDataObject = {};
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
    if (severity) qs['filter[severity]'] = severity;
    if (filterDetectedTimeAfter) qs['filter[detectedTimeAfter]'] = filterDetectedTimeAfter;
    if (filterDetectedTimeBefore) qs['filter[detectedTimeBefore]'] = filterDetectedTimeBefore;

    const alerts = await getAllByCursor.call(this, { path: '/alert/history/info', qs });
    const sliced = returnAll ? alerts : alerts.slice(0, limit);

    const enriched: IDataObject[] = [];
    for (const a of sliced as IDataObject[]) {
      const alert = a as any;
      const entityId = alert?.relationships?.entity?.data?.id || alert?.attributes?.entityId;
      const entityType = alert?.relationships?.entity?.data?.type || alert?.attributes?.entityType;
      const tenantId = alert?.relationships?.tenant?.data?.id;
      const tenantDomainPrefix = alert?.relationships?.tenant?.data?.attributes?.domainPrefix;
      const related = alert?.relationships?.relatedAlert?.data;

      let deviceInfo: IDataObject | undefined;
      if (entityType === 'device' && entityId) {
        const resp = await requestAuvik.call(this, { method: 'GET', path: `/inventory/device/info/${encodeURIComponent(entityId)}` });
        deviceInfo = Array.isArray(resp?.data) ? (resp.data[0] as IDataObject) : (resp?.data as IDataObject);
      }

      // Optional recent utilisation via Statistics (bandwidth)
      let utilisationSummary: IDataObject | undefined;
      if (includeUtilisation && entityType === 'device' && entityId) {
        let fromIso: string | undefined;
        let toIso: string | undefined;
        if (utilisationPreset && utilisationPreset !== 'CUSTOM') {
          const range = isoRangeFromPreset(utilisationPreset);
          fromIso = range.from;
          toIso = range.to;
        } else {
          toIso = new Date().toISOString();
          fromIso = new Date(Date.now() - utilisationWindowHours * 60 * 60 * 1000).toISOString();
        }
        const stats = await requestAuvik.call(this, {
          method: 'GET',
          path: '/stat/device/bandwidth',
          qs: { 'filter[fromTime]': fromIso, 'filter[thruTime]': toIso, 'filter[interval]': 'hour', 'filter[deviceId]': entityId, tenants: qs.tenants },
        });
        utilisationSummary = stats?.data as IDataObject;
      }
      // Optional last configuration reference (no content diff via API)
      let lastConfiguration: IDataObject | undefined;
      if (includeLastConfig && entityType === 'device' && entityId) {
        const configs = await getAllByCursor.call(this, { path: '/inventory/configuration', qs: { 'filter[deviceId]': entityId, tenants: qs.tenants, 'page[first]': 1 } });
        if (Array.isArray(configs) && configs.length) lastConfiguration = configs[0] as IDataObject;
      }

      // Build alert-centric output
      const attrs = alert?.attributes || {};
      const alertLinks = alert?.links || {};
      const entityLinks = alert?.relationships?.entity?.data?.links || {};

      // Device summary
      let deviceSummary: IDataObject | undefined;
      if (deviceInfo) {
        const da: any = (deviceInfo as any).attributes || {};
        const dlinks: any = (deviceInfo as any).links || {};
        deviceSummary = {
          id: (deviceInfo as any).id,
          name: da.deviceName || da.displayName || da.name,
          type: da.deviceType,
          vendor: da.vendorName,
          model: da.makeModel,
          serialNumber: da.serialNumber,
          softwareVersion: da.softwareVersion,
          onlineStatus: da.onlineStatus,
          lastSeenTime: da.lastSeenTime,
          links: dlinks,
        } as IDataObject;
      }

      // Utilisation summary
      let utilisation: IDataObject | undefined;
      if (utilisationSummary) {
        const u0: any = Array.isArray(utilisationSummary) ? utilisationSummary[0] : utilisationSummary;
        const ua = u0?.attributes || {};
        const report = ua?.reportPeriod || {};
        const statsArr = Array.isArray(ua?.stats) ? ua.stats : [];
        const firstSet = statsArr[0];
        let points = 0;
        let last: any;
        if (firstSet) {
          const legend: string[] = firstSet.legend || [];
          const dataRows: any[] = firstSet.data || [];
          points = dataRows.length;
          if (points > 0) {
            const idxRecorded = legend.indexOf('Recorded At');
            const idxTx = legend.indexOf('Transmit');
            const idxRx = legend.indexOf('Receive');
            const idxBw = legend.indexOf('Bandwidth');
            const row = dataRows[points - 1] || [];
            last = {
              recordedAt: idxRecorded >= 0 ? row[idxRecorded] : undefined,
              transmitBps: idxTx >= 0 ? row[idxTx] : undefined,
              receiveBps: idxRx >= 0 ? row[idxRx] : undefined,
              bandwidthBps: idxBw >= 0 ? row[idxBw] : undefined,
            };
          }
        }
        utilisation = {
          interval: ua.interval,
          fromTime: report.fromTime,
          thruTime: report.thruTime,
          points,
          last,
        } as IDataObject;
      }

      let lastConfigurationSummary: IDataObject | undefined;
      if (lastConfiguration) {
        const ca: any = (lastConfiguration as any).attributes || {};
        lastConfigurationSummary = {
          id: (lastConfiguration as any).id,
          backupTime: ca.backupTime || ca.lastBackupTime,
          isRunning: ca.isRunning,
          links: (lastConfiguration as any).links,
        } as IDataObject;
      }

      const composed: IDataObject = {
        alertId: alert?.id,
        alertName: attrs.name,
        severity: attrs.severity,
        status: attrs.status,
        detectedOn: attrs.detectedOn,
        dismissed: attrs.dismissed,
        dispatched: attrs.dispatched,
        tenantId,
        tenantDomainPrefix,
        entityType,
        entityId,
        alertLinks,
        entityLinks,
        relatedAlert: related ? { id: related.id, name: related?.attributes?.name, links: related.links } : undefined,
        device: deviceSummary,
        utilisation,
        lastConfiguration: lastConfigurationSummary,
      };

      enriched.push(composed);
    }

    // Optional bulk dismiss
    if (bulkDismiss) {
      if (!confirmBulkDismiss) {
        const { NodeOperationError } = require('n8n-workflow');
        throw new NodeOperationError(this.getNode(), 'Bulk dismiss is enabled but not confirmed. Tick "Confirm Bulk Dismiss" to proceed.');
      }
      for (const a of sliced as IDataObject[]) {
        const id = (a as any)?.id as string;
        if (!id) continue;
        await requestAuvik.call(this, { method: 'POST', path: `/alert/dismiss/${encodeURIComponent(id)}` });
      }
    }

    return [this.helpers.returnJsonArray(enriched)];
  }

  // 2) Health Snapshot
  if (operation === 'healthSnapshot') {
    const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
    const severityThreshold = this.getNodeParameter('severityThreshold', 0, 'critical') as string;
    const snapshotPreset = this.getNodeParameter('snapshotPreset', 0, 'LAST_7_DAYS') as string;
    let snapshotFrom = this.getNodeParameter('snapshotFrom', 0, '') as string;
    let snapshotTo = this.getNodeParameter('snapshotTo', 0, '') as string;
    const includeLists = this.getNodeParameter('includeLists', 0, false) as boolean;
    const tenantsCsv = Array.isArray(tenantsSel) && tenantsSel.length ? tenantsSel.join(',') : undefined;

    if (snapshotPreset && snapshotPreset !== 'CUSTOM') {
      const range = isoRangeFromPreset(snapshotPreset);
      snapshotFrom = range.from || snapshotFrom;
      snapshotTo = range.to || snapshotTo;
    }

    const devices = await getAllByCursor.call(this, { path: '/inventory/device/info', qs: tenantsCsv ? { tenants: tenantsCsv } : {} });
    const interfaces = await getAllByCursor.call(this, { path: '/inventory/interface/info', qs: tenantsCsv ? { tenants: tenantsCsv } : {} });

    const alertQs: IDataObject = {};
    if (tenantsCsv) alertQs.tenants = tenantsCsv;
    if (severityThreshold) alertQs['filter[severity]'] = severityThreshold;
    if (snapshotFrom) alertQs['filter[detectedTimeAfter]'] = snapshotFrom;
    if (snapshotTo) alertQs['filter[detectedTimeBefore]'] = snapshotTo;
    const alerts = await getAllByCursor.call(this, { path: '/alert/history/info', qs: alertQs });

    // ASM elements are optional; only fetch if ASM endpoints are exposed
    let asmClients: IDataObject[] = [];
    try {
      asmClients = (await getAllByCursor.call(this, { path: '/asm/client/info', qs: {} })) as IDataObject[];
    } catch {
      asmClients = [];
    }

    // Build structured snapshot
    const devicesArr = (Array.isArray(devices) ? devices : []) as IDataObject[];
    const interfacesArr = (Array.isArray(interfaces) ? interfaces : []) as IDataObject[];
    const alertsArr = (Array.isArray(alerts) ? alerts : []) as IDataObject[];
    const asmArr = (Array.isArray(asmClients) ? asmClients : []) as IDataObject[];

    // Devices summary
    const deviceOnlineStatus: Record<string, number> = {};
    const deviceByType: Record<string, number> = {};
    for (const d of devicesArr) {
      const a: any = (d as any)?.attributes || {};
      const status = String(a.onlineStatus || 'unknown').toLowerCase();
      const type = String(a.deviceType || 'unknown');
      deviceOnlineStatus[status] = (deviceOnlineStatus[status] || 0) + 1;
      deviceByType[type] = (deviceByType[type] || 0) + 1;
    }

    // Interfaces summary
    let adminUp = 0;
    let adminDown = 0;
    const ifaceOperationalStatus: Record<string, number> = {};
    for (const i of interfacesArr) {
      const a: any = (i as any)?.attributes || {};
      if (a.adminStatus === true) adminUp += 1;
      else if (a.adminStatus === false) adminDown += 1;
      const op = String(a.operationalStatus || 'unknown').toLowerCase();
      ifaceOperationalStatus[op] = (ifaceOperationalStatus[op] || 0) + 1;
    }

    // Alerts summary
    const alertsBySeverity: Record<string, number> = {};
    let dismissedCount = 0;
    for (const al of alertsArr) {
      const a: any = (al as any)?.attributes || {};
      const sev = String(a.severity || 'unknown').toLowerCase();
      alertsBySeverity[sev] = (alertsBySeverity[sev] || 0) + 1;
      if (a.dismissed === true) dismissedCount += 1;
    }
    const activeCount = alertsArr.length - dismissedCount;

    const snapshot: IDataObject = {
      context: {
        tenants: tenantsCsv,
        severityThreshold,
        time: { preset: snapshotPreset, from: snapshotFrom || undefined, to: snapshotTo || undefined },
      },
      counts: {
        devices: devicesArr.length,
        interfaces: interfacesArr.length,
        alerts: alertsArr.length,
        asmClients: asmArr.length,
      },
      alerts: {
        bySeverity: alertsBySeverity,
        active: activeCount,
        dismissed: dismissedCount,
        ...(includeLists ? { list: alertsArr } : {}),
      },
      devices: {
        byOnlineStatus: deviceOnlineStatus,
        byType: deviceByType,
        ...(includeLists ? { list: devicesArr } : {}),
      },
      interfaces: {
        adminUp,
        adminDown,
        byOperationalStatus: ifaceOperationalStatus,
        ...(includeLists ? { list: interfacesArr } : {}),
      },
      asm: {
        ...(includeLists ? { clients: asmArr } : {}),
      },
    };

    return [this.helpers.returnJsonArray([snapshot])];
  }





  return [this.helpers.returnJsonArray([])];
}


