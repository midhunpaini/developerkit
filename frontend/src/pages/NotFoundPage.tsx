import { Link } from 'react-router-dom';

import { Panel } from '@/components/common/Panel';
import { SeoMeta } from '@/components/seo/SeoMeta';

export function NotFoundPage() {
  return (
    <>
      <SeoMeta
        title="Page Not Found | DeveloperKit.dev"
        description="The requested page could not be found."
        robots="noindex, nofollow"
      />
      <div className="min-h-screen bg-appbg text-text">
        <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8">
          <Panel className="w-full p-6">
            <h1 className="text-xl font-semibold">Page not found</h1>
            <p className="mt-2 text-sm text-slate-300">
              The route you requested does not exist.
            </p>
            <div className="mt-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                Go to home
              </Link>
            </div>
          </Panel>
        </main>
      </div>
    </>
  );
}

export default NotFoundPage;
