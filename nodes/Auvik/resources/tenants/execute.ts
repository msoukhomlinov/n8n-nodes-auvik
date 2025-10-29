import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getAllByCursor } from '../../helpers/pagination';
import { requestAuvik } from '../../helpers/http/request';

export async function executeTenant(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: IDataObject[] = [];

  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'getMany') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;

    const data = await getAllByCursor.call(this, {
      path: '/tenants',
      apiVersion: 'v1',
    });

    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getManyDetail') {
    const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
    const limit = this.getNodeParameter('limit', 0, 100) as number;
    const tenantDomainPrefix = String(this.getNodeParameter('tenantDomainPrefix', 0) as string).trim();
    const filterAvailableTenants = this.getNodeParameter('filterAvailableTenants', 0) as boolean;

    const qs: IDataObject = {
      tenantDomainPrefix,
    };
    if (filterAvailableTenants) qs['filter[availableTenants]'] = true;

    const data = await getAllByCursor.call(this, {
      path: '/tenants/detail',
      apiVersion: 'v1',
      qs,
    });
    const sliced = returnAll ? data : data.slice(0, limit);
    for (const d of sliced) returnData.push(d as IDataObject);
  }

  if (operation === 'getOneDetail') {
    const id = this.getNodeParameter('id', 0) as string;
    const tenantDomainPrefix = String(this.getNodeParameter('tenantDomainPrefix', 0) as string).trim();
    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/tenants/detail/${encodeURIComponent(id)}`,
      apiVersion: 'v1',
      qs: { tenantDomainPrefix },
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


