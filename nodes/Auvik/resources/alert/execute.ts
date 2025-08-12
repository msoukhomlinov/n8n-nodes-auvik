import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { requestAuvik } from '../../helpers/http/request';

export async function executeAlert(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const operation = this.getNodeParameter('operation', 0) as string;

  if (operation === 'dismiss') {
    const id = this.getNodeParameter('id', 0) as string;
    const resp = await requestAuvik.call(this, {
      method: 'POST',
      path: `/alert/dismiss/${encodeURIComponent(id)}`,
    });
    const data: IDataObject = { success: true, id, response: resp };
    return [this.helpers.returnJsonArray([data])];
  }

  return [this.helpers.returnJsonArray([])];
}


