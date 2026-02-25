import { SITE_CONFIG } from '@/config/site';
import { Panel } from '@/components/common/Panel';

const GITHUB_REPO_URL = 'https://github.com/your-org/developertools';
const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/yourhandle';
const SHARE_URL =
  'https://twitter.com/intent/tweet?text=Free%20Developer%20Tools%20for%20developers&url=https%3A%2F%2Fdevelopertools.dev';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6">
        <Panel className="border-border/70 bg-slate-900/40 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">
              <span className="text-primary">[Support]</span>{' '}
              If these tools saved you time, consider supporting.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Star the DeveloperTools repository on GitHub"
              >
                Star on GitHub
              </a>
              <a
                href={SHARE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-border bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Share DeveloperTools.dev"
              >
                Share
              </a>
              <a
                href={BUY_ME_A_COFFEE_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-slate-400 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Buy me a coffee
              </a>
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright {year} {SITE_CONFIG.siteName}
          </p>
          <nav aria-label="Footer links" className="flex items-center gap-4">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              GitHub Repository
            </a>
            <a
              href="/robots.txt"
              className="hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              robots.txt
            </a>
            <a
              href="/sitemap.xml"
              className="hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Sitemap
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
