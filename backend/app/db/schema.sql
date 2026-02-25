CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id BIGSERIAL PRIMARY KEY,
  endpoint_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_expires_at
  ON webhook_endpoints (expires_at);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_active_expires
  ON webhook_endpoints (is_active, expires_at);

CREATE TABLE IF NOT EXISTS webhook_requests (
  id UUID PRIMARY KEY,
  endpoint_id TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  query_string TEXT NULL,
  status_code INTEGER NOT NULL,
  client_ip INET NULL,
  headers_json JSONB NOT NULL,
  content_type TEXT NOT NULL,
  body_size_bytes INTEGER NOT NULL,
  raw_body TEXT NOT NULL,
  parsed_json JSONB NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_requests_endpoint_received
  ON webhook_requests (endpoint_id, received_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_requests_endpoint_id
  ON webhook_requests (endpoint_id);

CREATE INDEX IF NOT EXISTS idx_webhook_requests_received_at
  ON webhook_requests (received_at);

