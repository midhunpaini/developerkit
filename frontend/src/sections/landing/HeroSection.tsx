import { Button } from '@/components/common/Button';
import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';

interface HeroSectionProps {
  onGenerateEndpoint: () => void | Promise<void>;
  isGeneratingEndpoint?: boolean;
  generateErrorMessage?: string | null;
}

export function HeroSection({
  onGenerateEndpoint,
  isGeneratingEndpoint = false,
  generateErrorMessage = null
}: HeroSectionProps) {
  return (
    <header className="border-b border-border/50 bg-appbg">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <SiteLogo />
          <a
            href="#faq"
            className="text-sm text-slate-300 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            FAQ
          </a>
        </div>

        <Panel className="p-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
              Developer Utility
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              Free Webhook Tester
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Instantly test and inspect webhook requests.
            </p>
            <div>
              <Button
                onClick={onGenerateEndpoint}
                variant="primary"
                disabled={isGeneratingEndpoint}
              >
                {isGeneratingEndpoint ? 'Generating...' : 'Generate Endpoint'}
              </Button>
            </div>
            {generateErrorMessage ? (
              <p className="text-sm text-error">
                {generateErrorMessage}
              </p>
            ) : null}
          </div>
        </Panel>
      </div>
    </header>
  );
}
