import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function buildConfigurationQuery(this: IExecuteFunctions): IDataObject {
  const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
  const filterDeviceId = this.getNodeParameter('filterDeviceId', 0, '') as string;
  const filterBackupTimeAfter = this.getNodeParameter('filterBackupTimeAfter', 0, '') as string;
  const filterBackupTimeBefore = this.getNodeParameter('filterBackupTimeBefore', 0, '') as string;
  const filterIsRunning = this.getNodeParameter('filterIsRunning', 0, false) as boolean;
  const qs: IDataObject = {};
  if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
  if (filterDeviceId) qs['filter[deviceId]'] = filterDeviceId;
  if (filterBackupTimeAfter) qs['filter[backupTimeAfter]'] = filterBackupTimeAfter;
  if (filterBackupTimeBefore) qs['filter[backupTimeBefore]'] = filterBackupTimeBefore;
  if (filterIsRunning) qs['filter[isRunning]'] = true;
  return qs;
}

export async function executeConfiguration(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const qs = buildConfigurationQuery.call(this);
    const data = await getAllByCursor.call(this, { path: '/inventory/configuration', qs });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOne') {
    const id = this.getNodeParameter('id', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/inventory/configuration/${encodeURIComponent(id)}` });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


