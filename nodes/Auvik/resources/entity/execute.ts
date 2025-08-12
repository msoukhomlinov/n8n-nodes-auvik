import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

export async function executeEntity(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getManyAudits') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const tenantsSel = this.getNodeParameter('tenants', 0, []) as string[];
    const qs: IDataObject = {};
    const filterUser = this.getNodeParameter('filterUser', 0, '') as string;
    const filterCategory = this.getNodeParameter('filterCategory', 0, '') as string;
    const filterStatus = this.getNodeParameter('filterStatus', 0, '') as string;
    const filterModifiedAfter = this.getNodeParameter('filterModifiedAfter', 0, '') as string;
    if (filterUser) qs['filter[user]'] = filterUser;
    if (filterCategory) qs['filter[category]'] = filterCategory;
    if (filterStatus) qs['filter[status]'] = filterStatus;
    if (filterModifiedAfter) qs['filter[modifiedAfter]'] = filterModifiedAfter;
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');

    const data = await getAllByCursor.call(this, { path: '/inventory/entity/audit', qs });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOneAudit') {
    const id = this.getNodeParameter('auditId', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/inventory/entity/audit/${encodeURIComponent(id)}` });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getManyNotes') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const tenantsSel = this.getNodeParameter('tenantsNotes', 0, []) as string[];
    const qs: IDataObject = {};
    const filterEntityId = this.getNodeParameter('filterEntityId', 0, '') as string;
    const filterEntityType = this.getNodeParameter('filterEntityType', 0, '') as string;
    const filterEntityName = this.getNodeParameter('filterEntityName', 0, '') as string;
    const filterLastModifiedBy = this.getNodeParameter('filterLastModifiedBy', 0, '') as string;
    const filterNotesModifiedAfter = this.getNodeParameter('filterNotesModifiedAfter', 0, '') as string;
    if (filterEntityId) qs['filter[entityId]'] = filterEntityId;
    if (filterEntityType) qs['filter[entityType]'] = filterEntityType;
    if (filterEntityName) qs['filter[entityName]'] = filterEntityName;
    if (filterLastModifiedBy) qs['filter[lastModifiedBy]'] = filterLastModifiedBy;
    if (filterNotesModifiedAfter) qs['filter[modifiedAfter]'] = filterNotesModifiedAfter;
    if (Array.isArray(tenantsSel) && tenantsSel.length) qs.tenants = tenantsSel.join(',');

    const data = await getAllByCursor.call(this, { path: '/inventory/entity/note', qs });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOneNote') {
    const id = this.getNodeParameter('noteId', 0) as string;
    const resp = await requestAuvik.call(this, { method: 'GET', path: `/inventory/entity/note/${encodeURIComponent(id)}` });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


