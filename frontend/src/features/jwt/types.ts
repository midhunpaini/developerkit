export interface JwtDecodeResult {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  headerSegment: string;
  payloadSegment: string;
}

