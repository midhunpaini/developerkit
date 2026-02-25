export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type ViewerTab = 'overview' | 'headers' | 'body' | 'raw';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface WebhookRequest {
  id: string;
  endpointId: string;
  method: HttpMethod;
  path: string;
  receivedAt: string;
  statusCode: number;
  ip: string;
  headers: Record<string, string>;
  contentType: string;
  bodySizeBytes: number;
  rawBody: string;
  parsedJson?: JsonValue;
}
