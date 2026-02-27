import { CRON_EXPRESSION_PARSER_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function CronExpressionParserPage() {
  return <ToolPlaceholderPage tool={CRON_EXPRESSION_PARSER_TOOL} />;
}

export default CronExpressionParserPage;

