import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { requestAuvik } from '../../helpers/http/request';

export async function executeUsage(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  let fromDate = this.getNodeParameter('fromDate', 0, '') as string;
  let thruDate = this.getNodeParameter('thruDate', 0, '') as string;
  const datePreset = this.getNodeParameter('datePreset', 0, 'LAST_30_DAYS') as string;
  if (datePreset && datePreset !== 'CUSTOM' && datePreset !== 'NO_FILTER') {
    const { computeDateRangeUtc } = await import('../../helpers/options/datePresets');
    const range = computeDateRangeUtc(datePreset as any);
    fromDate = range.from;
    thruDate = range.to;
  }
  if (fromDate) {
    const { assertDate } = await import('../../helpers/validation');
    assertDate.call(this, fromDate, 'filter[fromDate]');
  }
  if (thruDate) {
    const { assertDate } = await import('../../helpers/validation');
    assertDate.call(this, thruDate, 'filter[thruDate]');
  }

  if (operation === 'getClient') {
    const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
    const qs: IDataObject = {};
    if (fromDate) qs['filter[fromDate]'] = fromDate;
    if (thruDate) qs['filter[thruDate]'] = thruDate;
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');

    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: '/billing/usage/client',
      apiVersion: 'v1',
      qs,
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getDevice') {
    const id = this.getNodeParameter('id', 0) as string;
    const qs: IDataObject = {};
    if (fromDate) qs['filter[fromDate]'] = fromDate;
    if (thruDate) qs['filter[thruDate]'] = thruDate;

    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/billing/usage/device/${encodeURIComponent(id)}`,
      apiVersion: 'v1',
      qs,
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


