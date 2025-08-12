import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

function buildAlertHistoryQuery(this: IExecuteFunctions): IDataObject {
  const tenants = this.getNodeParameter('tenants', 0, '') as string;
  const filterSeverity = this.getNodeParameter('filterSeverity', 0, '') as string;
  const filterStatus = this.getNodeParameter('filterStatus', 0, '') as string;
  const filterEntityId = this.getNodeParameter('filterEntityId', 0, '') as string;
  const filterDismissed = this.getNodeParameter('filterDismissed', 0, false) as boolean;
  const filterDispatched = this.getNodeParameter('filterDispatched', 0, false) as boolean;
  const filterDetectedTimeAfter = this.getNodeParameter('filterDetectedTimeAfter', 0, '') as string;
  const filterDetectedTimeBefore = this.getNodeParameter('filterDetectedTimeBefore', 0, '') as string;

  const qs: IDataObject = {};
  if (tenants) qs.tenants = tenants;
  if (filterSeverity) qs['filter[severity]'] = filterSeverity;
  if (filterStatus) qs['filter[status]'] = filterStatus;
  if (filterEntityId) qs['filter[entityId]'] = filterEntityId;
  if (filterDismissed) qs['filter[dismissed]'] = true;
  if (filterDispatched) qs['filter[dispatched]'] = true;
  if (filterDetectedTimeAfter) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterDetectedTimeAfter, 'filter[detectedTimeAfter]');
    qs['filter[detectedTimeAfter]'] = filterDetectedTimeAfter;
  }
  if (filterDetectedTimeBefore) {
    const { assertIsoDateTime } = require('../../helpers/validation');
    assertIsoDateTime.call(this, filterDetectedTimeBefore, 'filter[detectedTimeBefore]');
    qs['filter[detectedTimeBefore]'] = filterDetectedTimeBefore;
  }

  return qs;
}

export async function executeAlertHistory(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const qs = buildAlertHistoryQuery.call(this);
    const data = await getAllByCursor.call(this, {
      path: '/alert/history/info',
      qs,
    });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOne') {
    const id = this.getNodeParameter('id', 0) as string;
    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/alert/history/info/${encodeURIComponent(id)}`,
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


