import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const serverDir = path.join(projectRoot, 'dist-server');
const rootIndexPath = path.join(distDir, 'index.html');
const PRERENDER_ROUTES = [
  '/',
  '/webhook-tester',
  '/jwt-debugger',
  '/json-formatter',
  '/hmac-generator'
];

function injectAttributes(html, tagName, attrs) {
  const normalized = attrs.trim();

  if (!normalized) {
    return html;
  }

  const tagPattern = new RegExp(`<${tagName}([^>]*)>`, 'i');

  return html.replace(tagPattern, (fullMatch, existingAttributes) => {
    const existing = String(existingAttributes ?? '').trim();
    const joined = [existing, normalized].filter(Boolean).join(' ');
    return `<${tagName}${joined ? ` ${joined}` : ''}>`;
  });
}

async function findServerEntryFile() {
  const files = await readdir(serverDir);
  const match = files.find((file) => /^entry-server\.(mjs|js|cjs)$/.test(file));

  if (!match) {
    throw new Error('SSR bundle not found in dist-server.');
  }

  return path.join(serverDir, match);
}

function routeToIndexPath(routePath) {
  if (routePath === '/') {
    return rootIndexPath;
  }

  const normalized = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  return path.join(distDir, normalized, 'index.html');
}

function renderRouteHtml(template, renderResult) {
  const { appHtml, headTags, htmlAttributes, bodyAttributes } = renderResult;

  let output = template.replace('<!--app-html-->', appHtml);
  output = output.replace('<!--head-tags-->', headTags);
  output = injectAttributes(output, 'html', htmlAttributes ?? '');
  output = injectAttributes(output, 'body', bodyAttributes ?? '');
  return output;
}

async function prerenderRoutes() {
  const template = await readFile(rootIndexPath, 'utf8');
  const serverEntryFile = await findServerEntryFile();
  const serverModule = await import(pathToFileURL(serverEntryFile).href);

  if (typeof serverModule.render !== 'function') {
    throw new Error('SSR render() export is missing from server bundle.');
  }

  for (const routePath of PRERENDER_ROUTES) {
    const renderResult = serverModule.render(routePath);
    const output = renderRouteHtml(template, renderResult);
    const outputPath = routeToIndexPath(routePath);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, output, 'utf8');
  }
}

prerenderRoutes().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
