export const API_VERSION = 'v1';
export const ISO_DATETIME_FORMAT = "YYYY-MM-DD'T'HH:mm:ss.SSS[Z]";

export function resolveBaseUrl(region: string, customBaseUrl?: string): string {
  if (region === 'custom' && customBaseUrl) return customBaseUrl;
  return `https://auvikapi.${region}.my.auvik.com/${API_VERSION}`;
}


