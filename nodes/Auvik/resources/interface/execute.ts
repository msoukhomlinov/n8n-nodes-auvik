import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function buildInterfaceQuery(this: IExecuteFunctions): IDataObject {
  const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
  const filterInterfaceType = this.getNodeParameter('filterInterfaceType', 0, '') as string;
  const filterParentDevice = this.getNodeParameter('filterParentDevice', 0, '') as string;
  const filterAdminStatus = this.getNodeParameter('filterAdminStatus', 0, '') as string;
  const filterOperationalStatus = this.getNodeParameter('filterOperationalStatus', 0, '') as string;
  const modifiedAfterPreset = this.getNodeParameter('modifiedAfterPreset', 0, 'LAST_7_DAYS') as string;
  let filterModifiedAfter = this.getNodeParameter('filterModifiedAfter', 0, '') as string;

  const qs: IDataObject = {};
  if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
  if (filterInterfaceType) qs['filter[interfaceType]'] = filterInterfaceType;
  if (filterParentDevice) qs['filter[parentDevice]'] = filterParentDevice;
  if (filterAdminStatus === 'true' || filterAdminStatus === 'false') {
    qs['filter[adminStatus]'] = filterAdminStatus;
  }
  if (filterOperationalStatus) qs['filter[operationalStatus]'] = filterOperationalStatus;
  if (modifiedAfterPreset && modifiedAfterPreset !== 'CUSTOM' && modifiedAfterPreset !== 'NO_FILTER') {
    const { computeAfterDateTimeUtc } = require('../../helpers/options/datePresets');
    filterModifiedAfter = computeAfterDateTimeUtc(modifiedAfterPreset);
  }
  if (filterModifiedAfter) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterModifiedAfter, 'filter[modifiedAfter]');
    qs['filter[modifiedAfter]'] = filterModifiedAfter;
  }
  return qs;
}

export async function executeInterface(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const qs = buildInterfaceQuery.call(this);
    const data = await getAllByCursor.call(this, {
      path: '/inventory/interface/info',
      apiVersion: 'v1',
      qs,
    });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOne') {
    const id = this.getNodeParameter('id', 0) as string;
    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/inventory/interface/info/${encodeURIComponent(id)}`,
      apiVersion: 'v1',
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


