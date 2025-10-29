import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';

export async function executeAsm(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getApps') {
    const clientId = this.getNodeParameter('clientId', 0) as string;
    const include = this.getNodeParameter('include', 0, []) as string[];
    const queryDatePreset = this.getNodeParameter('queryDatePreset', 0, 'LAST_30_DAYS') as string;
    let queryDate = this.getNodeParameter('queryDate', 0, '') as string;
    if (queryDatePreset && queryDatePreset !== 'CUSTOM') {
      const { computeAfterDateTimeUtc } = await import('../../helpers/options/datePresets');
      queryDate = computeAfterDateTimeUtc(queryDatePreset as any);
    }

    // New date filters for apps
    const dateAddedAfterPreset = this.getNodeParameter('dateAddedAfterPreset', 0, 'NONE') as string;
    let dateAddedAfter = this.getNodeParameter('dateAddedAfter', 0, '') as string;
    if (dateAddedAfterPreset && dateAddedAfterPreset !== 'CUSTOM' && dateAddedAfterPreset !== 'NONE') {
      const { computeAfterDateTimeUtc } = await import('../../helpers/options/datePresets');
      dateAddedAfter = computeAfterDateTimeUtc(dateAddedAfterPreset as any);
    }

    const dateAddedBeforePreset = this.getNodeParameter('dateAddedBeforePreset', 0, 'NONE') as string;
    let dateAddedBefore = this.getNodeParameter('dateAddedBefore', 0, '') as string;
    if (dateAddedBeforePreset && dateAddedBeforePreset !== 'CUSTOM' && dateAddedBeforePreset !== 'NONE') {
      const { computeBeforeDateTimeUtc } = await import('../../helpers/options/datePresets');
      dateAddedBefore = computeBeforeDateTimeUtc(dateAddedBeforePreset as any);
    }

    const userLastUsedAfterPreset = this.getNodeParameter('userLastUsedAfterPreset', 0, 'NONE') as string;
    let userLastUsedAfter = this.getNodeParameter('userLastUsedAfter', 0, '') as string;
    if (userLastUsedAfterPreset && userLastUsedAfterPreset !== 'CUSTOM' && userLastUsedAfterPreset !== 'NONE') {
      const { computeAfterDateTimeUtc } = await import('../../helpers/options/datePresets');
      userLastUsedAfter = computeAfterDateTimeUtc(userLastUsedAfterPreset as any);
    }

    const userLastUsedBeforePreset = this.getNodeParameter('userLastUsedBeforePreset', 0, 'NONE') as string;
    let userLastUsedBefore = this.getNodeParameter('userLastUsedBefore', 0, '') as string;
    if (userLastUsedBeforePreset && userLastUsedBeforePreset !== 'CUSTOM' && userLastUsedBeforePreset !== 'NONE') {
      const { computeBeforeDateTimeUtc } = await import('../../helpers/options/datePresets');
      userLastUsedBefore = computeBeforeDateTimeUtc(userLastUsedBeforePreset as any);
    }

    const qs: IDataObject = {};
    qs['filter[clientId]'] = clientId; // Required
    if (include && include.length > 0) qs.include = include.join(',');
    if (queryDate) qs['filter[queryDate]'] = queryDate;
    if (dateAddedAfter) qs['filter[dateAddedAfter]'] = dateAddedAfter;
    if (dateAddedBefore) qs['filter[dateAddedBefore]'] = dateAddedBefore;
    if (userLastUsedAfter) qs['filter[user_lastUsedAfter]'] = userLastUsedAfter;
    if (userLastUsedBefore) qs['filter[user_lastUsedBefore]'] = userLastUsedBefore;

    const data = await getAllByCursor.call(this, { path: '/asm/app/info', apiVersion: 'v1', qs });
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
    const data = await getAllByCursor.call(this, { path: '/asm/client/info', apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getLicenses') {
    const clientId = this.getNodeParameter('clientId', 0) as string;
    const applicationId = this.getNodeParameter('applicationId', 0) as string;
    const email = this.getNodeParameter('email', 0, '') as string;
    const licenseType = this.getNodeParameter('licenseType', 0, '') as string;
    const underutilizedOnly = this.getNodeParameter('underutilizedOnly', 0, false) as boolean;

    const lastLoginBeforePreset = this.getNodeParameter('lastLoginBeforePreset', 0, 'NONE') as string;
    let lastLoginBefore = this.getNodeParameter('lastLoginBefore', 0, '') as string;
    if (lastLoginBeforePreset && lastLoginBeforePreset !== 'CUSTOM' && lastLoginBeforePreset !== 'NONE') {
      const { computeBeforeDateTimeUtc } = await import('../../helpers/options/datePresets');
      lastLoginBefore = computeBeforeDateTimeUtc(lastLoginBeforePreset as any);
    }

    const qs: IDataObject = {};
    qs['filter[clientId]'] = clientId; // Required
    qs['filter[applicationId]'] = applicationId; // Required
    if (email) qs['filter[email]'] = email;
    if (licenseType) qs['filter[licenseType]'] = licenseType;
    if (lastLoginBefore) qs['filter[lastLoginBefore]'] = lastLoginBefore;
    if (underutilizedOnly) qs['filter[underutilizedOnly]'] = underutilizedOnly;

    const data = await getAllByCursor.call(this, { path: '/asm/license/info', apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getSecurityLogs') {
    const clientId = this.getNodeParameter('clientId', 0) as string;
    const include = this.getNodeParameter('include', 0, []) as string[];
    const queryDatePreset = this.getNodeParameter('queryDatePreset', 0, 'LAST_30_DAYS') as string;
    let queryDate = this.getNodeParameter('queryDate', 0, '') as string;
    if (queryDatePreset && queryDatePreset !== 'CUSTOM') {
      const { computeAfterDateTimeUtc } = await import('../../helpers/options/datePresets');
      queryDate = computeAfterDateTimeUtc(queryDatePreset as any);
    }
    const qs: IDataObject = {};
    qs['filter[clientId]'] = clientId; // Required
    if (include && include.length > 0) qs.include = include.join(',');
    if (queryDate) qs['filter[queryDate]'] = queryDate;
    const data = await getAllByCursor.call(this, { path: '/asm/securityLog/info', apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getTags') {
    const clientId = this.getNodeParameter('clientId', 0) as string;
    const applicationId = this.getNodeParameter('applicationId', 0, '') as string;
    const qs: IDataObject = {};
    qs['filter[clientId]'] = clientId; // Required
    if (applicationId) qs['filter[applicationId]'] = applicationId;
    const data = await getAllByCursor.call(this, { path: '/asm/tag/info', apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getUsers') {
    const clientId = this.getNodeParameter('clientId', 0) as string;
    const qs: IDataObject = {};
    qs['filter[clientId]'] = clientId; // Required
    const data = await getAllByCursor.call(this, { path: '/asm/user/info', apiVersion: 'v1', qs });
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


