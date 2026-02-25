import type { JsonValue, WebhookRequest } from '@/features/webhooks/types';

export function getBodySizeBytes(rawBody: string) {
  return new TextEncoder().encode(rawBody).length;
}

export function parseJsonBody(
  rawBody: string,
  contentType: string
): JsonValue | undefined {
  if (!contentType.toLowerCase().includes('json')) {
    return undefined;
  }

  try {
    return JSON.parse(rawBody) as JsonValue;
  } catch {
    return undefined;
  }
}

export function buildRawRequestText(request: WebhookRequest) {
  const headers = Object.entries(request.headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return [
    `${request.method} ${request.path} HTTP/1.1`,
    headers,
    '',
    request.rawBody
  ].join('\n');
}
