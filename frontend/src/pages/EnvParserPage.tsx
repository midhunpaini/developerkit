import { ENV_PARSER_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function EnvParserPage() {
  return <ToolPlaceholderPage tool={ENV_PARSER_TOOL} />;
}

export default EnvParserPage;

