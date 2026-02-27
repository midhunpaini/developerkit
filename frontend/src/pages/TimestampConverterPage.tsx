import { TIMESTAMP_CONVERTER_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function TimestampConverterPage() {
  return <ToolPlaceholderPage tool={TIMESTAMP_CONVERTER_TOOL} />;
}

export default TimestampConverterPage;

