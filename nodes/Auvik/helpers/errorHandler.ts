import { NodeApiError } from 'n8n-workflow';
import type { JsonObject } from 'n8n-workflow';

export function mapAuvikError(context: { getNode: () => any }, error: any): never {
  const vendorErrors = error?.response?.body?.errors as Array<{
    status?: string;
    title?: string;
    detail?: string;
  }> | undefined;

  const message = vendorErrors?.[0]?.detail || vendorErrors?.[0]?.title || error.message;

  throw new NodeApiError(context.getNode(), (error as unknown) as JsonObject, {
    message: message || 'Auvik API error',
  });
}


