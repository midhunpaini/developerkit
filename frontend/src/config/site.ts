export const SITE_CONFIG = {
  siteName: 'DeveloperKit.dev',
  siteUrl: 'https://developerkit.dev',
  brandColor: '#3b82f6',
  defaultOgImage: 'https://developerkit.dev/og-image.svg',
  endpointBasePath: '/hook/'
} as const;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function envUrl(name: 'VITE_API_BASE_URL' | 'VITE_HOOK_BASE_URL') {
  const raw = import.meta.env[name];
  if (typeof raw !== 'string' || !raw.trim()) {
    return null;
  }
  return trimTrailingSlash(raw.trim());
}

function inferDefaultApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8005';
  }

  const { protocol, hostname, origin } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:8005`;
  }

  return trimTrailingSlash(origin);
}

export function getApiBaseUrl() {
  return envUrl('VITE_API_BASE_URL') ?? inferDefaultApiBaseUrl();
}

export function getHookBaseUrl() {
  return envUrl('VITE_HOOK_BASE_URL') ?? getApiBaseUrl();
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export function buildEndpointUrl(endpointId: string) {
  return `${getHookBaseUrl()}${SITE_CONFIG.endpointBasePath}${endpointId}`;
}
