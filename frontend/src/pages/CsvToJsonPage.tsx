import { CSV_TO_JSON_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function CsvToJsonPage() {
  return <ToolPlaceholderPage tool={CSV_TO_JSON_TOOL} />;
}

export default CsvToJsonPage;

