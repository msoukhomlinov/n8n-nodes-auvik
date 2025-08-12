import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function buildDeviceQuery(this: IExecuteFunctions): IDataObject {
  const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
  const filterDeviceType = this.getNodeParameter('filterDeviceType', 0, '') as string;
  const filterVendorName = this.getNodeParameter('filterVendorName', 0, '') as string;
  const filterMakeModel = this.getNodeParameter('filterMakeModel', 0, '') as string;
  const filterOnlineStatus = this.getNodeParameter('filterOnlineStatus', 0, '') as string;
  const filterModifiedAfter = this.getNodeParameter('filterModifiedAfter', 0, '') as string;
  const filterNotSeenSince = this.getNodeParameter('filterNotSeenSince', 0, '') as string;
  const filterStateKnown = this.getNodeParameter('filterStateKnown', 0, false) as boolean;
  const includeDeviceDetail = this.getNodeParameter('includeDeviceDetail', 0, false) as boolean;
  const fieldsDeviceDetail = this.getNodeParameter('fieldsDeviceDetail', 0, []) as string[];

  const qs: IDataObject = {};
  if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
  if (filterDeviceType) qs['filter[deviceType]'] = filterDeviceType;
  if (filterVendorName) qs['filter[vendorName]'] = filterVendorName;
  if (filterMakeModel) qs['filter[makeModel]'] = filterMakeModel;
  if (filterOnlineStatus) qs['filter[onlineStatus]'] = filterOnlineStatus;
  if (filterModifiedAfter) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterModifiedAfter, 'filter[modifiedAfter]');
    qs['filter[modifiedAfter]'] = filterModifiedAfter;
  }
  if (filterNotSeenSince) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterNotSeenSince, 'filter[notSeenSince]');
    qs['filter[notSeenSince]'] = filterNotSeenSince;
  }
  if (filterStateKnown) qs['filter[stateKnown]'] = true;

  if (includeDeviceDetail) {
    qs.include = 'deviceDetail';
    if (fieldsDeviceDetail.length) qs['fields[deviceDetail]'] = fieldsDeviceDetail.join(',');
  }

  return qs;
}

export async function executeDevice(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;

    const qs = buildDeviceQuery.call(this);
    const data = await getAllByCursor.call(this, {
      path: '/inventory/device/info',
      qs,
    });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOne') {
    const id = this.getNodeParameter('id', 0) as string;
    const includeDeviceDetail = this.getNodeParameter('includeDeviceDetail', 0, false) as boolean;
    const fieldsDeviceDetail = this.getNodeParameter('fieldsDeviceDetail', 0, []) as string[];

    const qs: IDataObject = {};
    if (includeDeviceDetail) {
      qs.include = 'deviceDetail';
      if (fieldsDeviceDetail.length) qs['fields[deviceDetail]'] = fieldsDeviceDetail.join(',');
    }

    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/inventory/device/info/${encodeURIComponent(id)}`,
      qs,
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


