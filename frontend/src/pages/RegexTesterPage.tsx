import { REGEX_TESTER_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function RegexTesterPage() {
  return <ToolPlaceholderPage tool={REGEX_TESTER_TOOL} />;
}

export default RegexTesterPage;

