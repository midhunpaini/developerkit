import { JSON_DIFF_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function JsonDiffPage() {
  return <ToolPlaceholderPage tool={JSON_DIFF_TOOL} />;
}

export default JsonDiffPage;

