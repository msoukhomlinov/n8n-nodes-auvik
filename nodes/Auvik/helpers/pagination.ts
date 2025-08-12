import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { requestAuvik } from './http/request';

type Context = IExecuteFunctions | ILoadOptionsFunctions;

export interface CursorPageParams {
  path: string;
  qs?: IDataObject;
  include?: string;
  fields?: Record<string, string>;
  pageSize?: number; // page[first]
}

export async function getAllByCursor(this: Context, params: CursorPageParams): Promise<any[]> {
  const results: any[] = [];
  const qs: IDataObject = { ...(params.qs ?? {}) };
  if (params.include) qs.include = params.include;
  if (params.fields) {
    // fields[resource]=a,b
    for (const [resource, fieldsCsv] of Object.entries(params.fields)) {
      qs[`fields[${resource}]`] = fieldsCsv;
    }
  }
  const pageFirst = params.pageSize ?? 100;

  let cursorAfter: string | undefined;

  // Forward pagination using page[first] + page[after]
  while (true) {
    const page: IDataObject = { 'page[first]': pageFirst };
    if (cursorAfter) page['page[after]'] = cursorAfter;

    const response = await requestAuvik.call(this, {
      method: 'GET',
      path: params.path,
      qs: { ...qs, ...page },
    });

    const data = response?.data as any[] | undefined;
    if (Array.isArray(data)) results.push(...data);

    cursorAfter = response?.links?.next?.meta?.cursor as string | undefined;
    if (!cursorAfter) break;
  }

  return results;
}


