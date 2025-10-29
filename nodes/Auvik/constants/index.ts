export const ISO_DATETIME_FORMAT = "YYYY-MM-DD'T'HH:mm:ss.SSS[Z]";

export function resolveBaseUrl(region: string, customBaseUrl?: string): string {
  if (region === 'custom' && customBaseUrl) return customBaseUrl;
  return `https://auvikapi.${region}.my.auvik.com`;
}

export function buildVersionedPath(path: string, apiVersion: 'v1' | 'v2'): string {
  if (apiVersion === 'v2') {
    return `/${apiVersion}/api${path}`;
  }
  return `/${apiVersion}${path}`;
}


