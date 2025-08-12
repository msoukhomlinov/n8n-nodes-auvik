import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { resolveBaseUrl } from '../../constants/index';

type Context = IExecuteFunctions | ILoadOptionsFunctions;

export interface AuvikRequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string; // e.g. '/tenants'
  qs?: IDataObject;
  body?: IDataObject;
  headers?: IDataObject;
  timeoutMs?: number;
  maxRetries?: number; // for 429/503/504
}

const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_MAX_RETRIES = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestAuvik(this: Context, opts: AuvikRequestOptions): Promise<any> {
  const credentials = (await this.getCredentials('auvikApi')) as IDataObject;

  const region = String(credentials.region ?? 'us1');
  const customBaseUrl = (credentials.baseUrl as string) || undefined;
  const computedBaseUrl = (credentials.computedBaseUrl as string) || undefined;
  const baseURL = computedBaseUrl || resolveBaseUrl(region, customBaseUrl);

  const requestOptions: any = {
    method: opts.method,
    url: `${baseURL}${opts.path}`,
    qs: opts.qs,
    body: opts.body,
    json: true,
    timeout: opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    headers: {
      Accept: 'application/vnd.api+json',
      ...(opts.method !== 'GET' ? { 'Content-Type': 'application/vnd.api+json' } : {}),
      ...(opts.headers ?? {}),
    },
  };

  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES;

  let attempt = 0;
  while (true) {
    try {
      // Use credential-based auth headers from credential definition
      const response = await this.helpers.requestWithAuthentication.call(
        this,
        'auvikApi',
        requestOptions,
      );
      return response;
    } catch (error) {
      const status = (error as any)?.statusCode as number | undefined;
      const retriable = status === 429 || status === 503 || status === 504;
      if (retriable && attempt < maxRetries) {
        const retryAfterHeader = (error as any)?.response?.headers?.['retry-after'];
        const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;
        const backoff = retryAfterMs ?? Math.min(1000 * 2 ** attempt + Math.random() * 250, 10_000);
        attempt += 1;
        await sleep(backoff);
        continue;
      }
      throw new NodeApiError(this.getNode(), (error as unknown) as JsonObject, {
        message: 'Auvik API request failed',
      });
    }
  }
}


