import { OPENAPI_VALIDATOR_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function OpenapiValidatorPage() {
  return <ToolPlaceholderPage tool={OPENAPI_VALIDATOR_TOOL} />;
}

export default OpenapiValidatorPage;

