import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import { App } from '@/app/App';
import { AppProviders } from '@/app/AppProviders';

interface RenderResult {
  appHtml: string;
  headTags: string;
  htmlAttributes: string;
  bodyAttributes: string;
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: any } = {};

  const appHtml = renderToString(
    <AppProviders helmetContext={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </AppProviders>
  );

  const helmet = helmetContext.helmet;
  const headTags = [
    helmet?.title?.toString?.() ?? '',
    helmet?.priority?.toString?.() ?? '',
    helmet?.meta?.toString?.() ?? '',
    helmet?.link?.toString?.() ?? '',
    helmet?.script?.toString?.() ?? ''
  ].join('');

  return {
    appHtml,
    headTags,
    htmlAttributes: helmet?.htmlAttributes?.toString?.() ?? '',
    bodyAttributes: helmet?.bodyAttributes?.toString?.() ?? ''
  };
}
