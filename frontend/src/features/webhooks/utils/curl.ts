import { buildEndpointUrl } from '@/config/site';
import type { WebhookRequest } from '@/features/webhooks/types';

type CurlInput = WebhookRequest | { endpointId: string };

function isWebhookRequest(input: CurlInput): input is WebhookRequest {
  return 'id' in input;
}

function escapeSingleQuotes(value: string) {
  return value.replace(/'/g, `'\"'\"'`);
}

export function buildCurlCommand(input: CurlInput) {
  if (!isWebhookRequest(input)) {
    const url = buildEndpointUrl(input.endpointId);
    return `curl -X POST ${url} -H "Content-Type: application/json" -d '{"hello":"world"}'`;
  }

  const url = buildEndpointUrl(input.endpointId);
  const contentType =
    input.headers['Content-Type'] ??
    input.headers['content-type'] ??
    input.contentType;
  const escapedBody = escapeSingleQuotes(input.rawBody);

  return `curl -X ${input.method} ${url} -H "Content-Type: ${contentType}" -d '${escapedBody}'`;
}
