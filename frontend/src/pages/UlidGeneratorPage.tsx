import { ULID_GENERATOR_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function UlidGeneratorPage() {
  return <ToolPlaceholderPage tool={ULID_GENERATOR_TOOL} />;
}

export default UlidGeneratorPage;

