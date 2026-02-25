-- name: insert_request_if_active
WITH active_endpoint AS (
  UPDATE webhook_endpoints
  SET last_seen_at = now()
  WHERE endpoint_id = $1
    AND is_active = TRUE
    AND expires_at > now()
  RETURNING endpoint_id
)
INSERT INTO webhook_requests (
  id,
  endpoint_id,
  method,
  path,
  query_string,
  status_code,
  client_ip,
  headers_json,
  content_type,
  body_size_bytes,
  raw_body,
  parsed_json
)
SELECT
  $2::uuid,
  ae.endpoint_id,
  $3::text,
  $4::text,
  $5::text,
  $6::int,
  NULLIF($7::text, '')::inet,
  $8::jsonb,
  $9::text,
  $10::int,
  $11::text,
  CASE WHEN $12::text IS NULL THEN NULL ELSE $12::jsonb END
FROM active_endpoint ae
RETURNING
  id::text AS id,
  endpoint_id,
  received_at,
  method,
  path,
  status_code,
  COALESCE(host(client_ip), '') AS ip,
  headers_json::text AS headers_json_text,
  content_type,
  body_size_bytes,
  raw_body,
  parsed_json::text AS parsed_json_text;

-- name: list_requests_page
SELECT
  id::text AS id,
  endpoint_id,
  received_at,
  method,
  path,
  status_code,
  COALESCE(host(client_ip), '') AS ip,
  headers_json::text AS headers_json_text,
  content_type,
  body_size_bytes,
  raw_body,
  parsed_json::text AS parsed_json_text
FROM webhook_requests
WHERE endpoint_id = $1
ORDER BY received_at DESC, id DESC
LIMIT $2;

-- name: list_requests_page_before
SELECT
  id::text AS id,
  endpoint_id,
  received_at,
  method,
  path,
  status_code,
  COALESCE(host(client_ip), '') AS ip,
  headers_json::text AS headers_json_text,
  content_type,
  body_size_bytes,
  raw_body,
  parsed_json::text AS parsed_json_text
FROM webhook_requests
WHERE endpoint_id = $1
  AND (received_at, id) < ($2::timestamptz, $3::uuid)
ORDER BY received_at DESC, id DESC
LIMIT $4;

-- name: get_request_for_endpoint
SELECT
  id::text AS id,
  endpoint_id,
  received_at,
  method,
  path,
  status_code,
  COALESCE(host(client_ip), '') AS ip,
  headers_json::text AS headers_json_text,
  content_type,
  body_size_bytes,
  raw_body,
  parsed_json::text AS parsed_json_text
FROM webhook_requests
WHERE endpoint_id = $1
  AND id = $2::uuid
LIMIT 1;

