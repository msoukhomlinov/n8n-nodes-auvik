import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function buildNetworkQuery(this: IExecuteFunctions): IDataObject {
  const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
  const filterNetworkType = this.getNodeParameter('filterNetworkType', 0, '') as string;
  const filterScanStatus = this.getNodeParameter('filterScanStatus', 0, '') as string;
  const devicesSel = this.getNodeParameter('filterDevices', 0, []) as string[];
  const modifiedAfterPreset = this.getNodeParameter('modifiedAfterPreset', 0, 'LAST_7_DAYS') as string;
  let filterModifiedAfter = this.getNodeParameter('filterModifiedAfter', 0, '') as string;
  const includeNetworkDetail = this.getNodeParameter('includeNetworkDetail', 0, false) as boolean;
  const fieldsNetworkDetail = this.getNodeParameter('fieldsNetworkDetail', 0, []) as string[];

  const qs: IDataObject = {};
  if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
  if (filterNetworkType) qs['filter[networkType]'] = filterNetworkType;
  if (filterScanStatus) qs['filter[scanStatus]'] = filterScanStatus;
  if (Array.isArray(devicesSel) && devicesSel.length) qs['filter[devices]'] = devicesSel.join(',');
  if (modifiedAfterPreset && modifiedAfterPreset !== 'CUSTOM' && modifiedAfterPreset !== 'NO_FILTER') {
    const { computeAfterDateTimeUtc } = require('../../helpers/options/datePresets');
    filterModifiedAfter = computeAfterDateTimeUtc(modifiedAfterPreset);
  }
  if (filterModifiedAfter) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterModifiedAfter, 'filter[modifiedAfter]');
    qs['filter[modifiedAfter]'] = filterModifiedAfter;
  }

  if (includeNetworkDetail) {
    qs.include = 'networkDetail';
    if (fieldsNetworkDetail.length) qs['fields[networkDetail]'] = fieldsNetworkDetail.join(',');
  }

  return qs;
}

export async function executeNetwork(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const qs = buildNetworkQuery.call(this);

    const data = await getAllByCursor.call(this, {
      path: '/inventory/network/info',
      apiVersion: 'v1',
      qs,
    });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getManyDetail') {
    const returnAll = this.getNodeParameter('returnAll', 0, true) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;

    // Reuse existing query builder, then add detail-specific filters
    const qs = buildNetworkQuery.call(this);
    const filterScope = this.getNodeParameter('filterScope', 0, '') as string;
    if (filterScope) qs['filter[scope]'] = filterScope;

    const data = await getAllByCursor.call(this, {
      path: '/inventory/network/detail',
      apiVersion: 'v1',
      qs,
    });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOne') {
    const id = this.getNodeParameter('id', 0) as string;
    const includeNetworkDetail = this.getNodeParameter('includeNetworkDetail', 0, false) as boolean;
    const fieldsNetworkDetail = this.getNodeParameter('fieldsNetworkDetail', 0, []) as string[];
    const qs: IDataObject = {};
    if (includeNetworkDetail) {
      qs.include = 'networkDetail';
      if (fieldsNetworkDetail.length) qs['fields[networkDetail]'] = fieldsNetworkDetail.join(',');
    }

    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/inventory/network/info/${encodeURIComponent(id)}`,
      apiVersion: 'v1',
      qs,
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getOneDetail') {
    const id = this.getNodeParameter('id', 0) as string;

    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/inventory/network/detail/${encodeURIComponent(id)}`,
      apiVersion: 'v1',
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


