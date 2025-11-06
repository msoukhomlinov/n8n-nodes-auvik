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
    if (modifiedAfterPreset && modifiedAfterPreset !== 'CUSTOM' && modifiedAfterPreset !== 'NO_FILTER') {
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
    const compact = operation === 'getHistoryString' ? (this.getNodeParameter('compact', 0, false) as boolean) : false;
    const tenantsSel = this.getNodeParameter('tenantsHistory', 0, []) as string[];
    const deviceId = this.getNodeParameter('deviceId', 0, '') as string;
    const settingIdsCsv = this.getNodeParameter('settingIdsCsv', 0, '') as string;
    const interval = operation === 'getHistoryNumeric' ? (this.getNodeParameter('interval', 0, 'hour') as string) : '';
    const debugRequest = this.getNodeParameter('debugRequest', 0, false) as boolean;

    // Validate required tenants parameter
    if (!Array.isArray(tenantsSel) || tenantsSel.length === 0) {
      const { NodeOperationError } = await import('n8n-workflow');
      throw new NodeOperationError(this.getNode(), 'At least one tenant must be selected');
    }

    // Validate device exists if deviceId is provided
    if (deviceId) {
      try {
        const deviceQs: IDataObject = { tenants: tenantsSel.join(',') };
        const deviceResp = await requestAuvik.call(this, {
          method: 'GET',
          path: `/inventory/device/info/${encodeURIComponent(deviceId)}`,
          apiVersion: 'v1',
          qs: deviceQs,
        });

        if (!deviceResp?.data) {
          const { NodeOperationError } = await import('n8n-workflow');
          throw new NodeOperationError(
            this.getNode(),
            `Device ID '${deviceId}' not found in the selected tenant(s). Please verify the device exists and belongs to one of the selected tenants.`
          );
        }

        const deviceName = deviceResp.data?.attributes?.deviceName || 'Unknown';
        this.logger?.info?.(`[Auvik SNMP] Validated device: ${deviceName} (${deviceId})`);
      } catch (error: any) {
        if (error.name === 'NodeOperationError') {
          throw error;
        }
        const { NodeOperationError } = await import('n8n-workflow');
        throw new NodeOperationError(
          this.getNode(),
          `Failed to validate device ID '${deviceId}': ${error.message || 'Device not found or inaccessible'}`
        );
      }
    }

    // Validate SNMP Poller Settings if provided
    if (settingIdsCsv && deviceId) {
      try {
        const settingIds = settingIdsCsv.split(',').map(id => id.trim()).filter(id => id);

        // Get SNMP Poller Settings for this device
        const pollerQs: IDataObject = {
          tenants: tenantsSel.join(','),
          'filter[deviceId]': deviceId,
        };

        const pollerSettings = await getAllByCursor.call(this, {
          path: '/settings/snmppoller',
          apiVersion: 'v1',
          qs: pollerQs,
        });

        if (pollerSettings.length === 0) {
          const { NodeOperationError } = await import('n8n-workflow');
          throw new NodeOperationError(
            this.getNode(),
            `No SNMP Poller Settings found for device '${deviceId}'. Please configure SNMP Pollers for this device in Auvik first.`
          );
        }

        // Extract valid setting IDs and their details from the response
        const validSettingIds = pollerSettings
          .map((setting: any) => setting.id)
          .filter((id: string) => id);

        // Check if provided setting IDs are valid for this device
        const invalidIds = settingIds.filter(id => !validSettingIds.includes(id));

        if (invalidIds.length > 0) {
          const { NodeOperationError } = await import('n8n-workflow');
          const validCount = validSettingIds.length;
          throw new NodeOperationError(
            this.getNode(),
            `SNMP Poller Setting ID(s) not valid for this device: ${invalidIds.join(', ')}. ` +
            `This device has ${validCount} configured SNMP Poller Setting(s). ` +
            `Use 'Get Settings' operation with device filter to retrieve valid Setting IDs.`
          );
        }

        // Check if the settings are configured as pollers (not serialNo)
        const nonPollerSettings = pollerSettings
          .filter((setting: any) => settingIds.includes(setting.id))
          .filter((setting: any) => setting.attributes?.useAs !== 'poller')
          .map((setting: any) => ({
            id: setting.id,
            name: setting.attributes?.name || 'Unknown',
            useAs: setting.attributes?.useAs || 'unknown'
          }));

        if (nonPollerSettings.length > 0) {
          const { NodeOperationError } = await import('n8n-workflow');
          const details = nonPollerSettings.map(s => `${s.name} (useAs: ${s.useAs})`).join(', ');
          throw new NodeOperationError(
            this.getNode(),
            `SNMP Poller Setting(s) not configured as 'poller': ${details}. ` +
            `Only settings with useAs='poller' collect historical data. Settings with useAs='serialNo' do not have history.`
          );
        }

        this.logger?.info?.(`[Auvik SNMP] Validated ${settingIds.length} SNMP Poller Setting(s) for device`);
      } catch (error: any) {
        if (error.name === 'NodeOperationError') {
          throw error;
        }
        const { NodeOperationError } = await import('n8n-workflow');
        throw new NodeOperationError(
          this.getNode(),
          `Failed to validate SNMP Poller Settings: ${error.message || 'Unknown error'}`
        );
      }
    } else if (settingIdsCsv && !deviceId) {
      this.logger?.warn?.('[Auvik SNMP] SNMP Poller Setting IDs provided without Device ID - cannot validate if settings apply to a specific device');
    }

    let forceCompact = false;
    if (timePreset && timePreset !== 'CUSTOM' && timePreset !== 'NO_FILTER') {
      const { computeDateTimeRangeNoTzUtc, computeDateTimeRangeUtc } = await import('../../helpers/options/datePresets');
      const noTz = computeDateTimeRangeNoTzUtc(timePreset as any);
      fromTime = noTz.from;
      thruTime = noTz.to;
      // If range > 24h and user hasn't set compact, force compact=true to satisfy API limits (String only)
      if (operation === 'getHistoryString') {
        try {
          const iso = computeDateTimeRangeUtc(timePreset as any);
          const diffMs = new Date(iso.to).getTime() - new Date(iso.from).getTime();
          if (!compact && diffMs > 24 * 60 * 60 * 1000) {
            forceCompact = true;
          }
        } catch {}
      }
    } else if (timePreset === 'NO_FILTER' && !fromTime && !thruTime) {
      // API requires a time range; when no filter is selected, default to last 24 hours
      const { computeDateTimeRangeNoTzUtc } = await import('../../helpers/options/datePresets');
      const noTz = computeDateTimeRangeNoTzUtc('LAST_24_HOURS' as any);
      fromTime = noTz.from;
      thruTime = noTz.to;
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
    // Only apply compact to string endpoint, convert boolean to string "true"
    if (operation === 'getHistoryString' && (compact || forceCompact)) {
      qs['filter[compact]'] = 'true';
    }
    qs.tenants = tenantsSel.join(',');
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

      // Make actual API call in debug mode to see raw response
      try {
        const rawResp = await requestAuvik.call(this, {
          method: 'GET',
          path,
          apiVersion: 'v1',
          qs,
        });
        return [this.helpers.returnJsonArray([{
          debug: debugPayload,
          rawResponse: rawResp,
          dataCount: Array.isArray(rawResp?.data) ? rawResp.data.length : 0,
        }])];
      } catch (error: any) {
        return [this.helpers.returnJsonArray([{
          debug: debugPayload,
          error: error.message || String(error),
          errorDetails: error,
        }])];
      }
    }

    const data = await getAllByCursor.call(this, { path, apiVersion: 'v1', qs });

    // If no data returned, add helpful message
    if (data.length === 0) {
      const { NodeOperationError } = await import('n8n-workflow');
      const timeRange = `${fromTime || 'N/A'} to ${thruTime || 'now'}`;
      throw new NodeOperationError(
        this.getNode(),
        `No SNMP Poller history data found for the specified criteria. ` +
        `Time range: ${timeRange}. ` +
        `Possible reasons:\n` +
        `1. SNMP Poller History feature may not be enabled/available in your Auvik instance (added in 2022)\n` +
        `2. The SNMP Poller was recently configured and hasn't collected enough data yet (Auvik collects every 5 minutes)\n` +
        `3. No data exists for the specified time range - try a more recent time period\n` +
        `4. The SNMP Poller may not be actively collecting data - check the device is online and SNMP is accessible\n` +
        `5. Historical data may have been purged (Auvik stores history for 1 year)\n\n` +
        `Tip: Check the Auvik UI (Debug > All SNMP Pollers > click on poller name) to verify if historical data is visible there. ` +
        `If no history is shown in the UI either, the feature may not be available for your account. ` +
        `Enable Debug Request to see the raw API response.`
      );
    }

    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


