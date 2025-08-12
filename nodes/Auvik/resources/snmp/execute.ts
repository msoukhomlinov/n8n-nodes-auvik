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

    const data = await getAllByCursor.call(this, { path: '/settings/snmppoller', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getSetting') {
    const id = this.getNodeParameter('snmpPollerSettingId', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/settings/snmppoller/${encodeURIComponent(id)}` });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getSettingDevices') {
    const id = this.getNodeParameter('snmpPollerSettingId', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/settings/snmppoller/${encodeURIComponent(id)}/devices` });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getHistoryString' || operation === 'getHistoryNumeric') {
    const fromTime = this.getNodeParameter('fromTime', 0) as string;
    const thruTime = this.getNodeParameter('thruTime', 0, '') as string;
    const compact = this.getNodeParameter('compact', 0, false) as boolean;
    const tenantsSel = this.getNodeParameter('tenantsHistory', 0, []) as string[];
    const deviceId = this.getNodeParameter('deviceId', 0, '') as string;
    const settingIdsCsv = this.getNodeParameter('settingIdsCsv', 0, '') as string;

    const qs: IDataObject = {
      'filter[fromTime]': fromTime,
    };
    if (fromTime) {
      const { assertDateTimeNoTz } = await import('../../helpers/validation');
      assertDateTimeNoTz.call(this, fromTime, 'filter[fromTime]');
    }
    if (thruTime) {
      const { assertDateTimeNoTz } = await import('../../helpers/validation');
      assertDateTimeNoTz.call(this, thruTime, 'filter[thruTime]');
    }
    if (thruTime) qs['filter[thruTime]'] = thruTime;
    if (compact) qs['filter[compact]'] = true;
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
    if (deviceId) qs['filter[deviceId]'] = deviceId;
    if (settingIdsCsv) qs['filter[snmpPollerSettingId]'] = settingIdsCsv;

    const path = operation === 'getHistoryString' ? '/stat/snmppoller/string' : '/stat/snmppoller/int';
    const data = await getAllByCursor.call(this, { path, qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


