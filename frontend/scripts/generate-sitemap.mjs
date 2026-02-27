import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const projectRoot = process.cwd();
const outputPath = path.join(projectRoot, 'public', 'sitemap.xml');
const siteUrl = 'https://developerkit.dev';

const commonWatchPaths = [
  'src/config/site.ts',
  'src/config/tools.ts',
  'src/components/common/SiteLogo.tsx',
  'src/components/seo/SeoMeta.tsx',
  'src/sections/landing/Footer.tsx'
];

const routeDefinitions = [
  {
    path: '/',
    watchPaths: ['src/pages/LandingPage.tsx']
  },
  {
    path: '/webhook-tester',
    watchPaths: [
      'src/pages/WebhookViewerPage.tsx',
      'src/sections/viewer',
      'src/features/webhooks',
      'src/components/json',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/jwt-debugger',
    watchPaths: [
      'src/pages/JwtDebuggerPage.tsx',
      'src/features/jwt',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/json-formatter',
    watchPaths: [
      'src/pages/JsonFormatterPage.tsx',
      'src/features/json-formatter',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/hmac-generator',
    watchPaths: [
      'src/pages/HmacGeneratorPage.tsx',
      'src/features/hmac',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/regex-tester',
    watchPaths: [
      'src/pages/RegexTesterPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/base64-encoder-decoder',
    watchPaths: [
      'src/pages/Base64EncoderDecoderPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/url-encoder-decoder',
    watchPaths: [
      'src/pages/UrlEncoderDecoderPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/uuid-generator',
    watchPaths: [
      'src/pages/UuidGeneratorPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/timestamp-converter',
    watchPaths: [
      'src/pages/TimestampConverterPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/cron-expression-parser',
    watchPaths: [
      'src/pages/CronExpressionParserPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/json-diff',
    watchPaths: [
      'src/pages/JsonDiffPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/json-schema-validator',
    watchPaths: [
      'src/pages/JsonSchemaValidatorPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/openapi-validator',
    watchPaths: [
      'src/pages/OpenapiValidatorPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/curl-to-fetch',
    watchPaths: [
      'src/pages/CurlToFetchPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/sql-formatter',
    watchPaths: [
      'src/pages/SqlFormatterPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/xml-to-json',
    watchPaths: [
      'src/pages/XmlToJsonPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/csv-to-json',
    watchPaths: [
      'src/pages/CsvToJsonPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/json-to-typescript',
    watchPaths: [
      'src/pages/JsonToTypescriptPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/ulid-generator',
    watchPaths: [
      'src/pages/UlidGeneratorPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  },
  {
    path: '/env-parser',
    watchPaths: [
      'src/pages/EnvParserPage.tsx',
      'src/pages/ToolPlaceholderPage.tsx',
      'src/lib/seo.ts'
    ]
  }
];

function runCommand(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true
    });

    let stdout = '';

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.on('error', () => resolve(''));
    child.on('close', (code) => {
      resolve(code === 0 ? stdout.trim() : '');
    });
  });
}

async function getGitLastModified(relativePath) {
  const output = await runCommand('git', ['log', '-1', '--format=%cI', '--', relativePath]);
  if (!output) {
    return null;
  }

  const parsed = new Date(output);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function getFsLastModified(absolutePath) {
  try {
    const entry = await stat(absolutePath);
    if (entry.isFile()) {
      return entry.mtime;
    }
    if (!entry.isDirectory()) {
      return null;
    }
  } catch {
    return null;
  }

  const entries = await readdir(absolutePath, { withFileTypes: true });
  let latest = null;

  for (const item of entries) {
    const childPath = path.join(absolutePath, item.name);

    if (item.isDirectory()) {
      const nested = await getFsLastModified(childPath);
      if (nested && (!latest || nested.getTime() > latest.getTime())) {
        latest = nested;
      }
      continue;
    }

    if (item.isFile()) {
      const fileStat = await stat(childPath);
      if (!latest || fileStat.mtime.getTime() > latest.getTime()) {
        latest = fileStat.mtime;
      }
    }
  }

  return latest;
}

async function getPathLastModified(relativePath) {
  const gitDate = await getGitLastModified(relativePath);
  if (gitDate) {
    return gitDate;
  }
  return getFsLastModified(path.join(projectRoot, relativePath));
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildAbsoluteUrl(routePath) {
  if (routePath === '/') {
    return `${siteUrl}/`;
  }
  return `${siteUrl}${routePath}`;
}

function formatLastMod(date) {
  return date.toISOString();
}

async function resolveRouteLastMod(routeDefinition) {
  const watchSet = new Set([...commonWatchPaths, ...routeDefinition.watchPaths]);
  const dates = await Promise.all(
    [...watchSet].map(async (watchPath) => getPathLastModified(watchPath))
  );

  const validDates = dates.filter((value) => value instanceof Date);
  if (validDates.length === 0) {
    return new Date();
  }

  return new Date(Math.max(...validDates.map((item) => item.getTime())));
}

async function generateSitemap() {
  const routeData = await Promise.all(
    routeDefinitions.map(async (routeDefinition) => ({
      loc: buildAbsoluteUrl(routeDefinition.path),
      lastmod: formatLastMod(await resolveRouteLastMod(routeDefinition))
    }))
  );

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const route of routeData) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(route.loc)}</loc>`);
    lines.push(`    <lastmod>${escapeXml(route.lastmod)}</lastmod>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>', '');

  await writeFile(outputPath, lines.join('\n'), 'utf8');
}

generateSitemap().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
