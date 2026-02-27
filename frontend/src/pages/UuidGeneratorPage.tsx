import { UUID_GENERATOR_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function UuidGeneratorPage() {
  return <ToolPlaceholderPage tool={UUID_GENERATOR_TOOL} />;
}

export default UuidGeneratorPage;

