import { JSON_SCHEMA_VALIDATOR_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function JsonSchemaValidatorPage() {
  return <ToolPlaceholderPage tool={JSON_SCHEMA_VALIDATOR_TOOL} />;
}

export default JsonSchemaValidatorPage;

