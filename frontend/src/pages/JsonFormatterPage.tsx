import { JSON_FORMATTER_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function JsonFormatterPage() {
  return <ToolPlaceholderPage tool={JSON_FORMATTER_TOOL} />;
}

export default JsonFormatterPage;
