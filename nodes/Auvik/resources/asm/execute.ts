import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';

export async function executeAsm(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getApps') {
    const clientId = this.getNodeParameter('clientId', 0, '') as string;
    const include = this.getNodeParameter('include', 0, '') as string;
    const queryDatePreset = this.getNodeParameter('queryDatePreset', 0, 'LAST_30_DAYS') as string;
    let queryDate = this.getNodeParameter('queryDate', 0, '') as string;
    if (queryDatePreset && queryDatePreset !== 'CUSTOM') {
      const { computeAfterDateTimeUtc } = await import('../../helpers/options/datePresets');
      queryDate = computeAfterDateTimeUtc(queryDatePreset as any);
    }
    const qs: IDataObject = {};
    if (clientId) qs['filter[clientId]'] = clientId;
    if (include) qs.include = include;
    if (queryDate) qs['filter[queryDate]'] = queryDate;
    const data = await getAllByCursor.call(this, { path: '/asm/app/info', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getClients') {
    const include = this.getNodeParameter('include', 0, '') as string;
    const queryDatePreset = this.getNodeParameter('queryDatePreset', 0, 'LAST_30_DAYS') as string;
    let queryDate = this.getNodeParameter('queryDate', 0, '') as string;
    if (queryDatePreset && queryDatePreset !== 'CUSTOM') {
      const { computeAfterDateTimeUtc } = await import('../../helpers/options/datePresets');
      queryDate = computeAfterDateTimeUtc(queryDatePreset as any);
    }
    const qs: IDataObject = {};
    if (include) qs.include = include; // totals
    if (queryDate) qs['filter[queryDate]'] = queryDate;
    const data = await getAllByCursor.call(this, { path: '/asm/client/info', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getSecurityLogs') {
    const clientId = this.getNodeParameter('clientId', 0, '') as string;
    const include = this.getNodeParameter('include', 0, '') as string;
    const queryDatePreset = this.getNodeParameter('queryDatePreset', 0, 'LAST_30_DAYS') as string;
    let queryDate = this.getNodeParameter('queryDate', 0, '') as string;
    if (queryDatePreset && queryDatePreset !== 'CUSTOM') {
      const { computeAfterDateTimeUtc } = await import('../../helpers/options/datePresets');
      queryDate = computeAfterDateTimeUtc(queryDatePreset as any);
    }
    const qs: IDataObject = {};
    if (clientId) qs['filter[clientId]'] = clientId;
    if (include) qs.include = include; // users,applications
    if (queryDate) qs['filter[queryDate]'] = queryDate;
    const data = await getAllByCursor.call(this, { path: '/asm/securityLog/info', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getTags') {
    const clientId = this.getNodeParameter('clientId', 0, '') as string;
    const applicationId = this.getNodeParameter('applicationId', 0, '') as string;
    const qs: IDataObject = {};
    if (clientId) qs['filter[clientId]'] = clientId;
    if (applicationId) qs['filter[applicationId]'] = applicationId;
    const data = await getAllByCursor.call(this, { path: '/asm/tag/info', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getUsers') {
    const clientId = this.getNodeParameter('clientId', 0, '') as string;
    const qs: IDataObject = {};
    if (clientId) qs['filter[clientId]'] = clientId;
    const data = await getAllByCursor.call(this, { path: '/asm/user/info', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


