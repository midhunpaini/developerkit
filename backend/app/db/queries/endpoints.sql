-- name: create_endpoint
INSERT INTO webhook_endpoints (endpoint_id, expires_at)
VALUES ($1, now() + ($2::int * interval '1 second'))
RETURNING endpoint_id, created_at, expires_at;

-- name: get_active_endpoint
SELECT endpoint_id, created_at, expires_at
FROM webhook_endpoints
WHERE endpoint_id = $1
  AND is_active = TRUE
  AND expires_at > now()
LIMIT 1;

