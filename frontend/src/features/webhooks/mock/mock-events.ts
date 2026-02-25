import { getBodySizeBytes, parseJsonBody } from '@/features/webhooks/utils/body';
import { createSeededRandom } from '@/features/webhooks/mock/seed';
import type { WebhookRequest } from '@/features/webhooks/types';

function randomIp(nextRandom: () => number) {
  const octet = () => Math.floor(nextRandom() * 255);
  return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

function createRequest({
  id,
  endpointId,
  method,
  statusCode,
  headers,
  rawBody,
  offsetMs
}: {
  id: string;
  endpointId: string;
  method: WebhookRequest['method'];
  statusCode: number;
  headers: Record<string, string>;
  rawBody: string;
  offsetMs: number;
}) {
  const contentType = headers['Content-Type'] ?? 'application/octet-stream';
  const receivedAt = new Date(Date.now() + offsetMs).toISOString();
  const path = `/hook/${endpointId}`;
  const bodySizeBytes = getBodySizeBytes(rawBody);

  return {
    id,
    endpointId,
    method,
    path,
    receivedAt,
    statusCode,
    ip: headers['X-Forwarded-For'] ?? '127.0.0.1',
    headers,
    contentType,
    bodySizeBytes,
    rawBody,
    parsedJson: parseJsonBody(rawBody, contentType)
  } satisfies WebhookRequest;
}

export function createMockWebhookEvents(endpointId: string) {
  const nextRandom = createSeededRandom(endpointId);
  const stripeIp = randomIp(nextRandom);
  const shopifyIp = randomIp(nextRandom);
  const invalidIp = randomIp(nextRandom);

  const stripeBody = JSON.stringify(
    {
      id: `evt_${endpointId.slice(0, 8)}`,
      type: 'payment_intent.succeeded',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: `pi_${endpointId}`,
          amount: 4200,
          currency: 'usd',
          metadata: {
            source: 'webhooktester'
          }
        }
      }
    },
    null,
    2
  );

  const shopifyBody = JSON.stringify({
    id: 987654321,
    topic: 'orders/create',
    shop_domain: 'demo-store.myshopify.com',
    order_number: 1234,
    total_price: '59.99',
    line_items: [
      { title: 'Webhook Tester Hoodie', quantity: 1, price: '59.99' }
    ]
  });

  const invalidBody = '{"event":"delivery.failed","reason":"invalid_signature", "retry":true';

  return [
    createRequest({
      id: `${endpointId}-1`,
      endpointId,
      method: 'POST',
      statusCode: 200,
      offsetMs: 1500,
      headers: {
        Host: 'webhooktester.dev',
        'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
        'Content-Type': 'application/json',
        'Stripe-Signature': 't=1730000000,v1=mocksignature',
        'X-Forwarded-For': stripeIp
      },
      rawBody: stripeBody
    }),
    createRequest({
      id: `${endpointId}-2`,
      endpointId,
      method: 'POST',
      statusCode: 202,
      offsetMs: 3500,
      headers: {
        Host: 'webhooktester.dev',
        'User-Agent': 'Shopify-Webhooks/1.0',
        'Content-Type': 'application/json',
        'X-Shopify-Topic': 'orders/create',
        'X-Shopify-Hmac-Sha256': 'mock-hmac',
        'X-Forwarded-For': shopifyIp
      },
      rawBody: shopifyBody
    }),
    createRequest({
      id: `${endpointId}-3`,
      endpointId,
      method: 'POST',
      statusCode: 400,
      offsetMs: 6000,
      headers: {
        Host: 'webhooktester.dev',
        'User-Agent': 'WebhookTester Mock Client',
        'Content-Type': 'application/json',
        'X-Forwarded-For': invalidIp
      },
      rawBody: invalidBody
    })
  ] satisfies WebhookRequest[];
}
