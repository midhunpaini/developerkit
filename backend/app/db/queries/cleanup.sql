-- name: delete_expired_requests_batch
WITH doomed AS (
  SELECT id
  FROM webhook_requests
  WHERE received_at <= now() - ($1::int * interval '1 second')
  ORDER BY received_at ASC
  LIMIT $2
)
DELETE FROM webhook_requests wr
USING doomed
WHERE wr.id = doomed.id
RETURNING wr.id;

-- name: delete_expired_endpoints_batch
WITH doomed AS (
  SELECT id
  FROM webhook_endpoints
  WHERE expires_at <= now()
  ORDER BY expires_at ASC
  LIMIT $1
)
DELETE FROM webhook_endpoints we
USING doomed
WHERE we.id = doomed.id
RETURNING we.id;

