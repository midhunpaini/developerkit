import { HMAC_GENERATOR_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function HmacGeneratorPage() {
  return <ToolPlaceholderPage tool={HMAC_GENERATOR_TOOL} />;
}

export default HmacGeneratorPage;
