import { Link } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { CopyButton } from '@/components/common/CopyButton';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';

interface ViewerTopBarProps {
  endpointUrl: string;
  onGenerateNew: () => void | Promise<void>;
  isGeneratingNew?: boolean;
}

export function ViewerTopBar({
  endpointUrl,
  onGenerateNew,
  isGeneratingNew = false
}: ViewerTopBarProps) {
  return (
    <Panel className="p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="rounded-md hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Go to DeveloperKit.dev home page"
          >
            <SiteLogo compact />
          </Link>
          <Button
            className="lg:hidden"
            onClick={onGenerateNew}
            variant="primary"
            disabled={isGeneratingNew}
          >
            {isGeneratingNew ? 'Generating...' : 'Generate New'}
          </Button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:justify-end">
          <div className="min-w-0 rounded-md border border-border bg-slate-900/60 px-3 py-2">
            <p className="truncate text-xs text-slate-400">Current endpoint URL</p>
            <code className="block truncate text-sm text-slate-100">
              {endpointUrl}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton value={endpointUrl} label="Copy URL" ariaLabel="Copy endpoint URL" />
            <Button
              className="hidden lg:inline-flex"
              onClick={onGenerateNew}
              variant="primary"
              disabled={isGeneratingNew}
            >
              {isGeneratingNew ? 'Generating...' : 'Generate New Endpoint'}
            </Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
