import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

export async function executeSnmp(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getSettings') {
    const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
    const filterDeviceId = this.getNodeParameter('filterDeviceId', 0, '') as string;
    const filterUseAs = this.getNodeParameter('filterUseAs', 0, '') as string;
    const filterType = this.getNodeParameter('filterType', 0, '') as string;
    const filterDeviceType = this.getNodeParameter('filterDeviceType', 0, '') as string;
    const filterMakeModel = this.getNodeParameter('filterMakeModel', 0, '') as string;
    const filterVendorName = this.getNodeParameter('filterVendorName', 0, '') as string;
    const filterOid = this.getNodeParameter('filterOid', 0, '') as string;
    const filterName = this.getNodeParameter('filterName', 0, '') as string;
    const qs: IDataObject = {};
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
    if (filterDeviceId) qs['filter[deviceId]'] = filterDeviceId;
    if (filterUseAs) qs['filter[useAs]'] = filterUseAs;
    if (filterType) qs['filter[type]'] = filterType;
    if (filterDeviceType) qs['filter[deviceType]'] = filterDeviceType;
    if (filterMakeModel) qs['filter[makeModel]'] = filterMakeModel;
    if (filterVendorName) qs['filter[vendorName]'] = filterVendorName;
    if (filterOid) qs['filter[oid]'] = filterOid;
    if (filterName) qs['filter[name]'] = filterName;

    const data = await getAllByCursor.call(this, { path: '/settings/snmppoller', apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getSetting') {
    const id = this.getNodeParameter('snmpPollerSettingId', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/settings/snmppoller/${encodeURIComponent(id)}`, apiVersion: 'v1' });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getSettingDevices') {
    const id = this.getNodeParameter('snmpPollerSettingId', 0) as string;
    const tenantsSel = this.getNodeParameter('tenantsDevices', 0, []) as string[];
    const filterOnlineStatus = this.getNodeParameter('filterOnlineStatus', 0, '') as string;
    const modifiedAfterPreset = this.getNodeParameter('modifiedAfterPreset', 0, 'LAST_7_DAYS') as string;
    let filterModifiedAfter = this.getNodeParameter('filterModifiedAfter', 0, '') as string;
    const filterNotSeenSince = this.getNodeParameter('filterNotSeenSince', 0, '') as string;
    const filterDeviceTypeDevices = this.getNodeParameter('filterDeviceTypeDevices', 0, '') as string;
    const filterMakeModelDevices = this.getNodeParameter('filterMakeModelDevices', 0, '') as string;
    const filterVendorNameDevices = this.getNodeParameter('filterVendorNameDevices', 0, '') as string;

    const qs: IDataObject = {};
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
    if (filterOnlineStatus) qs['filter[onlineStatus]'] = filterOnlineStatus;
    if (modifiedAfterPreset && modifiedAfterPreset !== 'CUSTOM') {
      const { computeAfterDateTimeUtc } = require('../../helpers/options/datePresets');
      filterModifiedAfter = computeAfterDateTimeUtc(modifiedAfterPreset);
    }
    if (filterModifiedAfter) {
      const { assertIsoDateTime } = require('../../helpers/validation');
      assertIsoDateTime.call(this, filterModifiedAfter, 'filter[modifiedAfter]');
      qs['filter[modifiedAfter]'] = filterModifiedAfter;
    }
    if (filterNotSeenSince) qs['filter[notSeenSince]'] = filterNotSeenSince;
    if (filterDeviceTypeDevices) qs['filter[deviceType]'] = filterDeviceTypeDevices;
    if (filterMakeModelDevices) qs['filter[makeModel]'] = filterMakeModelDevices;
    if (filterVendorNameDevices) qs['filter[vendorName]'] = filterVendorNameDevices;

    const path = `/settings/snmppoller/${encodeURIComponent(id)}/devices`;
    const data = await getAllByCursor.call(this, { path, apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getHistoryString' || operation === 'getHistoryNumeric') {
    const timePreset = this.getNodeParameter('timePreset', 0, 'LAST_24_HOURS') as string;
    let fromTime = this.getNodeParameter('fromTime', 0, '') as string;
    let thruTime = this.getNodeParameter('thruTime', 0, '') as string;
    const compact = this.getNodeParameter('compact', 0, false) as boolean;
    const tenantsSel = this.getNodeParameter('tenantsHistory', 0, []) as string[];
    const deviceId = this.getNodeParameter('deviceId', 0, '') as string;
    const settingIdsCsv = this.getNodeParameter('settingIdsCsv', 0, '') as string;
    const interval = operation === 'getHistoryNumeric' ? (this.getNodeParameter('interval', 0, 'hour') as string) : '';
    const debugRequest = this.getNodeParameter('debugRequest', 0, false) as boolean;

    let forceCompact = false;
    if (timePreset && timePreset !== 'CUSTOM') {
      const { computeDateTimeRangeNoTzUtc, computeDateTimeRangeUtc } = await import('../../helpers/options/datePresets');
      const noTz = computeDateTimeRangeNoTzUtc(timePreset as any);
      fromTime = noTz.from;
      thruTime = noTz.to;
      // If range > 24h and user hasn't set compact, force compact=true to satisfy API limits
      try {
        const iso = computeDateTimeRangeUtc(timePreset as any);
        const diffMs = new Date(iso.to).getTime() - new Date(iso.from).getTime();
        if (!compact && diffMs > 24 * 60 * 60 * 1000) {
          forceCompact = true;
        }
      } catch {}
    }

    const qs: IDataObject = {};
    if (fromTime) {
      const { assertDateTimeNoTz } = await import('../../helpers/validation');
      assertDateTimeNoTz.call(this, fromTime, 'filter[fromTime]');
      qs['filter[fromTime]'] = fromTime;
    }
    if (thruTime) {
      const { assertDateTimeNoTz } = await import('../../helpers/validation');
      assertDateTimeNoTz.call(this, thruTime, 'filter[thruTime]');
      qs['filter[thruTime]'] = thruTime;
    }
    if (compact || forceCompact) qs['filter[compact]'] = true;
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
    if (deviceId) qs['filter[deviceId]'] = deviceId;
    if (settingIdsCsv) qs['filter[snmpPollerSettingId]'] = settingIdsCsv;
    if (operation === 'getHistoryNumeric' && interval) qs['filter[interval]'] = interval;

    const path = operation === 'getHistoryString' ? '/stat/snmppoller/string' : '/stat/snmppoller/int';
    if (debugRequest) {
      const debugPayload = {
        path,
        qs,
        meta: {
          operation,
          timePreset,
          compactRequested: compact,
          interval: operation === 'getHistoryNumeric' ? interval : undefined,
        },
      } as IDataObject;
      this.logger?.info?.(`[Auvik SNMP] Request: ${JSON.stringify(debugPayload)}`);
      return [this.helpers.returnJsonArray([{ debug: debugPayload }])];
    }

    const data = await getAllByCursor.call(this, { path, apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


