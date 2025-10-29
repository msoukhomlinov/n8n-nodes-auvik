import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function buildComponentQuery(this: IExecuteFunctions): IDataObject {
  const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
  const modifiedAfterPreset = this.getNodeParameter('modifiedAfterPreset', 0, 'LAST_7_DAYS') as string;
  let filterModifiedAfter = this.getNodeParameter('filterModifiedAfter', 0, '') as string;
  const filterDeviceId = this.getNodeParameter('filterDeviceId', 0, '') as string;
  const filterDeviceName = this.getNodeParameter('filterDeviceName', 0, '') as string;
  const filterCurrentStatus = this.getNodeParameter('filterCurrentStatus', 0, '') as string;

  const qs: IDataObject = {};
  if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
  if (modifiedAfterPreset && modifiedAfterPreset !== 'CUSTOM') {
    const { computeAfterDateTimeUtc } = require('../../helpers/options/datePresets');
    filterModifiedAfter = computeAfterDateTimeUtc(modifiedAfterPreset);
  }
  if (filterModifiedAfter) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterModifiedAfter, 'filter[modifiedAfter]');
    qs['filter[modifiedAfter]'] = filterModifiedAfter;
  }
  if (filterDeviceId) qs['filter[deviceId]'] = filterDeviceId;
  if (filterDeviceName) qs['filter[deviceName]'] = filterDeviceName;
  if (filterCurrentStatus) qs['filter[currentStatus]'] = filterCurrentStatus;
  return qs;
}

export async function executeComponent(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const qs = buildComponentQuery.call(this);
    const data = await getAllByCursor.call(this, { path: '/inventory/component/info', apiVersion: 'v1', qs });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOne') {
    const id = this.getNodeParameter('id', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/inventory/component/info/${encodeURIComponent(id)}`, apiVersion: 'v1' });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


