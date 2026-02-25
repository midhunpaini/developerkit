import { JWT_DEBUGGER_TOOL } from '@/config/tools';
import { ToolPlaceholderPage } from '@/pages/ToolPlaceholderPage';

export function JwtDebuggerPage() {
  return <ToolPlaceholderPage tool={JWT_DEBUGGER_TOOL} />;
}

export default JwtDebuggerPage;
