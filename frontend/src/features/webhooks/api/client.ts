import { buildApiUrl } from '@/config/site';
import type { WebhookRequest } from '@/features/webhooks/types';

export interface CreateWebhookEndpointResponse {
  endpointId: string;
  hookUrl: string;
  createdAt: string;
  expiresAt: string;
}

export interface ListWebhookRequestsResponse {
  items: WebhookRequest[];
  nextCursor: string | null;
}

interface BackendErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
  detail?: unknown;
}

export class WebhookApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'WebhookApiError';
    this.status = status;
    this.code = code;
  }
}

function stringifyDetail(detail: unknown) {
  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item === 'object' && 'msg' in item) {
          const msg = (item as { msg?: unknown }).msg;
          if (typeof msg === 'string') {
            return msg;
          }
        }

        return JSON.stringify(item);
      })
      .join(', ');
  }

  if (detail && typeof detail === 'object') {
    return JSON.stringify(detail);
  }

  return null;
}

async function readErrorPayload(response: Response): Promise<BackendErrorPayload | null> {
  try {
    return (await response.json()) as BackendErrorPayload;
  } catch {
    return null;
  }
}

function createErrorFromResponse(response: Response, payload: BackendErrorPayload | null) {
  const message =
    payload?.error?.message ??
    stringifyDetail(payload?.detail) ??
    `Request failed with status ${response.status}`;
  const code = payload?.error?.code;

  return new WebhookApiError(message, response.status, code);
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const payload = await readErrorPayload(response);
    throw createErrorFromResponse(response, payload);
  }

  return (await response.json()) as T;
}

export async function createWebhookEndpoint(signal?: AbortSignal) {
  return fetchJson<CreateWebhookEndpointResponse>('/api/endpoints', {
    method: 'POST',
    signal
  });
}

export async function listWebhookRequests(
  endpointId: string,
  options?: {
    limit?: number;
    before?: string | null;
    signal?: AbortSignal;
  }
) {
  const search = new URLSearchParams();
  search.set('limit', String(options?.limit ?? 50));
  search.set('includeBody', 'true');
  if (options?.before) {
    search.set('before', options.before);
  }

  return fetchJson<ListWebhookRequestsResponse>(
    `/api/endpoints/${encodeURIComponent(endpointId)}/requests?${search.toString()}`,
    {
      method: 'GET',
      signal: options?.signal
    }
  );
}

export function buildWebhookStreamUrl(endpointId: string) {
  return buildApiUrl(`/api/endpoints/${encodeURIComponent(endpointId)}/stream`);
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof WebhookApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Request failed';
}
