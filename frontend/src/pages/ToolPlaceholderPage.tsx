import { Link } from 'react-router-dom';

import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { SeoMeta } from '@/components/seo/SeoMeta';
import type { ToolMetadata } from '@/config/tools';
import { SITE_CONFIG } from '@/config/site';
import { buildSoftwareApplicationJsonLdForTool } from '@/lib/seo';
import { Footer } from '@/sections/landing/Footer';

interface ToolPlaceholderPageProps {
  tool: ToolMetadata;
}

export function ToolPlaceholderPage({ tool }: ToolPlaceholderPageProps) {
  return (
    <>
      <SeoMeta
        title={tool.seoTitle}
        description={tool.seoDescription}
        canonical={`${SITE_CONFIG.siteUrl}${tool.routePath}`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}${tool.routePath}`,
          type: 'website'
        }}
        jsonLd={buildSoftwareApplicationJsonLdForTool(tool)}
      />

      <div className="flex min-h-screen flex-col bg-appbg text-text">
        <header className="border-b border-border/50 bg-appbg">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-6">
            <Link
              to="/"
              className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Go to DeveloperTools.dev home"
            >
              <SiteLogo />
            </Link>
            <Link
              to="/"
              className="text-sm text-slate-300 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              All tools
            </Link>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
          <section aria-labelledby={`${tool.slug}-heading`}>
            <Panel className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex rounded-md border border-border bg-slate-900/60 px-2 py-0.5 text-xs font-medium text-slate-300">
                    Coming soon
                  </span>
                </div>
                <h1
                  id={`${tool.slug}-heading`}
                  className="text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                >
                  {tool.name}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  {tool.pageIntro}
                </p>
              </div>
            </Panel>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}

export default ToolPlaceholderPage;
