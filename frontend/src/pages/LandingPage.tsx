import { Link } from 'react-router-dom';

import { Panel } from '@/components/common/Panel';
import { SiteLogo } from '@/components/common/SiteLogo';
import { SeoMeta } from '@/components/seo/SeoMeta';
import { TOOLS } from '@/config/tools';
import { SITE_CONFIG } from '@/config/site';
import { Footer } from '@/sections/landing/Footer';

export function LandingPage() {
  return (
    <>
      <SeoMeta
        title="Free Developer Tools | DeveloperKit.dev"
        description="Free online tools for developers including webhook tester, JWT debugger, JSON formatter and more."
        canonical={`${SITE_CONFIG.siteUrl}/`}
        openGraph={{
          url: `${SITE_CONFIG.siteUrl}/`,
          type: 'website'
        }}
      />

      <div className="flex min-h-screen flex-col bg-appbg text-text">
        <header className="border-b border-border/50 bg-appbg">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
            <div className="flex items-center gap-4">
              <SiteLogo />
            </div>

            <Panel className="p-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                  Free Developer Tools
                </h1>
                <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                  Simple, fast, and free tools for developers. No login required.
                </p>
              </div>
            </Panel>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-8 pt-6">
          <section id="tools" aria-labelledby="tools-heading">
            <h2 id="tools-heading" className="sr-only">
              Tool Directory
            </h2>

            <ul className="grid gap-4 sm:grid-cols-2">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <article className="h-full">
                    <Link
                      to={tool.routePath}
                      className="block h-full rounded-md border border-border bg-panel p-4 shadow-panel transition-colors hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label={`Open ${tool.name}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold text-text">
                          {tool.name}
                        </h3>
                        <span
                          className={`inline-flex shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${
                            tool.status === 'active'
                              ? 'border-success/40 bg-success/10 text-success'
                              : 'border-border bg-slate-900/60 text-slate-300'
                          }`}
                        >
                          {tool.status === 'active' ? 'Active' : 'Coming soon'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {tool.shortDescription}
                      </p>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
