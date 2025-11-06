import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function buildConfigurationQuery(this: IExecuteFunctions): IDataObject {
  const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
  const filterDeviceId = this.getNodeParameter('filterDeviceId', 0, '') as string;
  const backupTimePreset = this.getNodeParameter('backupTimePreset', 0, 'LAST_30_DAYS') as string;
  let filterBackupTimeAfter = this.getNodeParameter('filterBackupTimeAfter', 0, '') as string;
  let filterBackupTimeBefore = this.getNodeParameter('filterBackupTimeBefore', 0, '') as string;
  if (backupTimePreset && backupTimePreset !== 'CUSTOM' && backupTimePreset !== 'NO_FILTER') {
    const { computeDateTimeRangeUtc } = require('../../helpers/options/datePresets');
    const range = computeDateTimeRangeUtc(backupTimePreset as any);
    filterBackupTimeAfter = range.from;
    filterBackupTimeBefore = range.to;
  }
  const runningState = this.getNodeParameter('runningState', 0, 'ALL') as string;
  const qs: IDataObject = {};
  if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');
  if (filterDeviceId) qs['filter[deviceId]'] = filterDeviceId;
  if (filterBackupTimeAfter) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterBackupTimeAfter, 'filter[backupTimeAfter]');
    qs['filter[backupTimeAfter]'] = filterBackupTimeAfter;
  }
  if (filterBackupTimeBefore) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterBackupTimeBefore, 'filter[backupTimeBefore]');
    qs['filter[backupTimeBefore]'] = filterBackupTimeBefore;
  }
  if (runningState === 'RUNNING') qs['filter[isRunning]'] = true;
  if (runningState === 'NOT_RUNNING') qs['filter[isRunning]'] = false;
  return qs;
}

export async function executeConfiguration(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const qs = buildConfigurationQuery.call(this);
    const data = await getAllByCursor.call(this, { path: '/inventory/configuration', apiVersion: 'v1', qs });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOne') {
    const id = this.getNodeParameter('id', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/inventory/configuration/${encodeURIComponent(id)}`, apiVersion: 'v1' });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


