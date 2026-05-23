import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { resolveBaseUrl, buildVersionedPath } from '../../constants/index';
import { isRateLimited, mapAuvikError } from '../errorHandler';

type Context = IExecuteFunctions | ILoadOptionsFunctions;

export interface AuvikRequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string; // e.g. '/tenants'
  apiVersion: 'v1' | 'v2';
  qs?: IDataObject;
  body?: IDataObject;
  headers?: IDataObject;
  timeoutMs?: number;
  maxRetries?: number; // for 429/503/504 and 403-rate-limit
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

  if (!opts.apiVersion) {
    throw new NodeOperationError(this.getNode(), 'apiVersion is required');
  }

  const requestOptions: any = {
    method: opts.method,
    uri: `${baseURL}${buildVersionedPath(opts.path, opts.apiVersion)}`,
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

  // Ensure Authorization header is always present (trim inputs to avoid stray whitespace)
  const email = String(credentials.email ?? '').trim();
  const apiKey = String(credentials.apiKey ?? '').trim();
  if (email || apiKey) {
    const basic = Buffer.from(`${email}:${apiKey}`).toString('base64');
    requestOptions.headers.Authorization = `Basic ${basic}`;
  }

  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES;

  let attempt = 0;
  while (true) {
    try {
      // Send request with explicit headers we set above to avoid auth header clobbering
      const response = await this.helpers.request.call(this, requestOptions);
      return response;
    } catch (error) {
      const status = (error as any)?.statusCode as number | undefined;
      const rateLimited = isRateLimited(error);
      const retriable = rateLimited || status === 503 || status === 504;
      if (retriable && attempt < maxRetries) {
        const retryAfterHeader = (error as any)?.response?.headers?.['retry-after'];
        const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;
        // Rate-limited: bigger exponent + bigger jitter so the 60s ceiling is
        // reachable (1s/4s/16s/60s) and sibling workers don't lockstep.
        // 5xx: keep the existing modest curve (1s/2s/4s, 10s ceiling).
        const baseMs = rateLimited
          ? 1000 * 4 ** attempt + Math.random() * 2000
          : 1000 * 2 ** attempt + Math.random() * 250;
        const ceilingMs = rateLimited ? 60_000 : 10_000;
        const backoff = retryAfterMs ?? Math.min(baseMs, ceilingMs);
        attempt += 1;
        await sleep(backoff);
        continue;
      }
      mapAuvikError(this, error);
      // Unreachable — mapAuvikError throws (`: never`). Defensive throw in
      // case the contract is ever weakened.
      throw error;
    }
  }
}
