import { CURL_TO_FETCH_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function CurlToFetchPage() {
  return <ToolPlaceholderPage tool={CURL_TO_FETCH_TOOL} />;
}

export default CurlToFetchPage;

