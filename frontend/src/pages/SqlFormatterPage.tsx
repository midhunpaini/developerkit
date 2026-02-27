import { SQL_FORMATTER_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function SqlFormatterPage() {
  return <ToolPlaceholderPage tool={SQL_FORMATTER_TOOL} />;
}

export default SqlFormatterPage;

