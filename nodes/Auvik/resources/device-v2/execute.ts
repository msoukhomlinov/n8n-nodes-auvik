import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { requestAuvik } from '../../helpers/http/request';
import { getAllByCursor } from '../../helpers/pagination';

export async function executeDeviceV2(this: IExecuteFunctions) {
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    return await executeGetMany.call(this);
  } else if (operation === 'getOne') {
    return await executeGetOne.call(this);
  }

  throw new NodeApiError(this.getNode(), {
    message: `Unknown operation: ${operation}`,
  });
}

async function executeGetMany(this: IExecuteFunctions) {
  const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
  const limit = this.getNodeParameter('limit', 0, 1000) as number;
  const tenant = this.getNodeParameter('tenant', 0) as string;
  const filterDeviceType = this.getNodeParameter('filterDeviceType', 0, '') as string;
  const filterMake = this.getNodeParameter('filterMake', 0, '') as string;
  const filterModel = this.getNodeParameter('filterModel', 0, '') as string;
  const filterMakeModel = this.getNodeParameter('filterMakeModel', 0, '') as string;
  const filterOnlineStatus = this.getNodeParameter('filterOnlineStatus', 0, '') as string;
  const filterManageStatus = this.getNodeParameter('filterManageStatus', 0, '') as string;
  const filterNetworks = this.getNodeParameter('filterNetworks', 0, []) as string[];
  const filterNotSeenSince = this.getNodeParameter('filterNotSeenSince', 0, '') as string;
  const filterNotSeenSincePreset = this.getNodeParameter('filterNotSeenSincePreset', 0, '') as string;

  const qs: Record<string, any> = {};

  // Single tenant parameter (v2 change)
  if (tenant) {
    qs.tenant = tenant;
  }

  // Device type filter
  if (filterDeviceType) {
    qs['filter[deviceType]'] = filterDeviceType;
  }

  // Make filter (v2: vendorName -> make)
  if (filterMake) {
    qs['filter[make]'] = filterMake;
  }

  // Model filter (v2: old makeModel -> model)
  if (filterModel) {
    qs['filter[model]'] = filterModel;
  }

  // New combined makeModel filter
  if (filterMakeModel) {
    qs['filter[makeModel]'] = filterMakeModel;
  }

  // Online status filter
  if (filterOnlineStatus) {
    qs['filter[onlineStatus]'] = filterOnlineStatus;
  }

  // New managed status filter (v2)
  if (filterManageStatus) {
    qs['filter[manageStatus]'] = filterManageStatus === 'true';
  }

  // Networks filter
  if (filterNetworks && filterNetworks.length > 0) {
    qs['filter[networks]'] = filterNetworks.join(',');
  }

  // Not seen since filter
  let notSeenSinceValue = filterNotSeenSince;
  if (filterNotSeenSincePreset && filterNotSeenSincePreset !== 'CUSTOM' && !notSeenSinceValue) {
    // Apply preset if no manual value provided
    const { computeAfterDateTimeUtc } = require('../../helpers/options/datePresets');
    notSeenSinceValue = computeAfterDateTimeUtc(filterNotSeenSincePreset);
  }
  if (notSeenSinceValue) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, notSeenSinceValue, 'filter[notSeenSince]');
    qs['filter[notSeenSince]'] = notSeenSinceValue;
  }

  if (returnAll) {
    // Use pagination helper with v2 defaults
    const results = await getAllByCursor.call(this, {
      path: '/inventory/device/info',
      apiVersion: 'v2',
      qs,
    });
    return [this.helpers.returnJsonArray(results)];
  } else {
    // Single page request with limit
    const response = await requestAuvik.call(this, {
      method: 'GET',
      path: '/inventory/device/info',
      apiVersion: 'v2',
      qs: {
        ...qs,
        'page[first]': limit,
      },
    });

    const data = response?.data as any[] | undefined;
    return [this.helpers.returnJsonArray(data || [])];
  }
}

async function executeGetOne(this: IExecuteFunctions) {
  const deviceId = this.getNodeParameter('deviceId', 0) as string;

  if (!deviceId) {
    throw new NodeApiError(this.getNode(), {
      message: 'Device ID is required',
    });
  }

  const response = await requestAuvik.call(this, {
    method: 'GET',
    path: `/inventory/device/info/${deviceId}`,
    apiVersion: 'v2',
  });

  const data = response?.data;
  return [this.helpers.returnJsonArray(data ? [data] : [])];
}
