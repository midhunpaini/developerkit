import type { JsonValue } from '@/features/webhooks/types';

import { JsonNode } from '@/components/json/JsonNode';

interface JsonTreeProps {
  value: JsonValue;
}

export function JsonTree({ value }: JsonTreeProps) {
  return <JsonNode value={value} />;
}

export default JsonTree;
