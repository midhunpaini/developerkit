import { JSON_TO_TYPESCRIPT_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function JsonToTypescriptPage() {
  return <ToolPlaceholderPage tool={JSON_TO_TYPESCRIPT_TOOL} />;
}

export default JsonToTypescriptPage;

