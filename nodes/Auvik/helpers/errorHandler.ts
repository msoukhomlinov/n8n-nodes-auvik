import { NodeApiError } from 'n8n-workflow';
import type { JsonObject } from 'n8n-workflow';

// Auvik empirically returns HTTP 403 with one of these words in the body
// when throttling (rather than 429). Not guaranteed by Auvik public docs —
// revisit if behaviour drifts.
export const RATE_LIMIT_PATTERN = /rate[\s-]?limit|quota|throttl/i;

// n8n's helpers.request (request-promise-native) puts the parsed payload on
// error.error when json:true; raw bodies live on error.response.body. Probe
// both, then fall back to error.message.
function safeStringify(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

export function extractErrorBody(error: any): string {
  const fromError = safeStringify(error?.error);
  if (fromError) return fromError;
  const fromResponse = safeStringify(error?.response?.body);
  if (fromResponse) return fromResponse;
  return safeStringify(error?.message);
}

export function isRateLimited(error: any): boolean {
  const status = error?.statusCode as number | undefined;
  if (status === 429) return true;
  if (status !== 403) return false;
  return RATE_LIMIT_PATTERN.test(extractErrorBody(error));
}

function getVendorErrors(error: any): Array<{ status?: string; title?: string; detail?: string }> | undefined {
  const body = error?.error ?? error?.response?.body;
  if (body && typeof body === 'object' && Array.isArray((body as any).errors)) {
    return (body as any).errors;
  }
  return undefined;
}

function friendlyMessageForStatus(error: any): string | undefined {
  const status = error?.statusCode as number | undefined;
  if (status === 401) return 'Invalid Auvik credentials (HTTP 401). Check Email and API Key.';
  if (status === 403) {
    if (isRateLimited(error)) {
      return 'Auvik API rate limit hit (HTTP 403 with rate-limit body). Retried automatically — reduce concurrency or add delays if this persists.';
    }
    return 'Auvik API forbidden (HTTP 403). The credential lacks permission for this endpoint or tenant.';
  }
  if (status === 404) return 'Auvik resource not found (HTTP 404). Verify the ID and tenant scope.';
  if (status === 429) return 'Auvik API rate limit hit (HTTP 429). Retried automatically — slow the workflow if this persists.';
  if (status && status >= 500) return `Auvik API service error (HTTP ${status}). Auvik may be degraded; retry later.`;
  return undefined;
}

// IMPORTANT: this function's `: never` return type is load-bearing — callers
// in request.ts rely on it to terminate `while (true)` retry loops. Do not
// change the return type without auditing call sites.
export function mapAuvikError(context: { getNode: () => any }, error: any): never {
  const vendorErrors = getVendorErrors(error);
  const message =
    vendorErrors?.[0]?.detail ||
    vendorErrors?.[0]?.title ||
    friendlyMessageForStatus(error) ||
    error?.message;

  throw new NodeApiError(context.getNode(), (error as unknown) as JsonObject, {
    message: message || 'Auvik API request failed',
  });
}
