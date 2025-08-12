import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { requestAuvik } from '../../helpers/http/request';

export async function executeUsage(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: IDataObject[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;

  const fromDate = this.getNodeParameter('fromDate', 0) as string;
  const thruDate = this.getNodeParameter('thruDate', 0) as string;
  if (fromDate) {
    const { assertDate } = await import('../../helpers/validation');
    assertDate.call(this, fromDate, 'filter[fromDate]');
  }
  if (thruDate) {
    const { assertDate } = await import('../../helpers/validation');
    assertDate.call(this, thruDate, 'filter[thruDate]');
  }

  if (operation === 'getClient') {
    const tenants = this.getNodeParameter('tenants', 0, '') as string;
    const qs: IDataObject = {
      'filter[fromDate]': fromDate,
      'filter[thruDate]': thruDate,
    };
    if (tenants) qs.tenants = tenants;

    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: '/billing/usage/client',
      qs,
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  if (operation === 'getDevice') {
    const id = this.getNodeParameter('id', 0) as string;
    const resp = await requestAuvik.call(this, {
      method: 'GET',
      path: `/billing/usage/device/${encodeURIComponent(id)}`,
      qs: {
        'filter[fromDate]': fromDate,
        'filter[thruDate]': thruDate,
      },
    });
    const data = Array.isArray(resp?.data) ? resp.data : [resp?.data];
    for (const d of data) returnData.push(d as IDataObject);
  }

  return [this.helpers.returnJsonArray(returnData)];
}


