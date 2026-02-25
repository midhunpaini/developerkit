import type { ViewerTab } from '@/features/webhooks/types';

export const MOCK_EVENT_DELAYS_MS = [1500, 3500, 6000] as const;

export const VIEWER_TABS: ReadonlyArray<{ value: ViewerTab; label: string }> = [
  { value: 'overview', label: 'Overview' },
  { value: 'headers', label: 'Headers' },
  { value: 'body', label: 'Body' },
  { value: 'raw', label: 'Raw' }
];
