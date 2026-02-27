export type ToolStatus = 'active' | 'coming-soon';

export interface ToolMetadata {
  slug: 'webhook-tester' | 'jwt-debugger' | 'json-formatter' | 'hmac-generator';
  name: string;
  routePath: `/${string}`;
  status: ToolStatus;
  shortDescription: string;
  seoTitle: string;
  seoDescription: string;
  jsonLdDescription: string;
  pageIntro: string;
}

export const TOOLS: ToolMetadata[] = [
  {
    slug: 'webhook-tester',
    name: 'Webhook Tester',
    routePath: '/webhook-tester',
    status: 'active',
    shortDescription:
      'Generate temporary endpoints and inspect incoming webhook requests in real time.',
    seoTitle: 'Free Webhook Tester | DeveloperKit.dev',
    seoDescription:
      'Instantly test and inspect webhook requests. Generate temporary endpoints and debug payloads in real time.',
    jsonLdDescription:
      'Free webhook tester for generating temporary endpoints and inspecting incoming HTTP requests in real time.',
    pageIntro:
      'Generate temporary webhook endpoints, inspect incoming requests, and debug headers and payloads in real time.'
  },
  {
    slug: 'jwt-debugger',
    name: 'JWT Debugger',
    routePath: '/jwt-debugger',
    status: 'active',
    shortDescription:
      'Decode tokens, inspect claims, and validate JWT structure quickly in the browser.',
    seoTitle: 'Free JWT Debugger | DeveloperKit.dev',
    seoDescription:
      'Decode JWT tokens, inspect header and payload claims, and check token expiry instantly.',
    jsonLdDescription:
      'Free JWT debugger for decoding tokens and inspecting claims, headers, and token status.',
    pageIntro:
      'Decode JSON Web Tokens, inspect headers and claims, and quickly review token status.'
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    routePath: '/json-formatter',
    status: 'active',
    shortDescription:
      'Format, validate, and inspect JSON payloads with a fast, minimal interface.',
    seoTitle: 'Free JSON Formatter | DeveloperKit.dev',
    seoDescription:
      'Format, minify, and validate JSON payloads instantly with a fast developer-focused JSON formatter.',
    jsonLdDescription:
      'Free JSON formatter for formatting, minifying, and validating JSON payloads.',
    pageIntro:
      'Format, minify, and validate JSON payloads with a simple and fast interface.'
  },
  {
    slug: 'hmac-generator',
    name: 'HMAC Generator',
    routePath: '/hmac-generator',
    status: 'active',
    shortDescription:
      'Generate HMAC signatures for webhook verification and API request debugging.',
    seoTitle: 'Free HMAC Signature Generator & Verifier | DeveloperKit.dev',
    seoDescription:
      'Generate and verify HMAC signatures for webhook verification and API debugging. Supports SHA-1, SHA-256, SHA-384, and SHA-512 with hex or base64 output.',
    jsonLdDescription:
      'Free HMAC signature generator and verifier for webhook and API debugging workflows.',
    pageIntro:
      'Generate and verify HMAC signatures for webhook verification and API debugging workflows.'
  }
];

export const TOOL_MAP: Record<ToolMetadata['slug'], ToolMetadata> = Object.fromEntries(
  TOOLS.map((tool) => [tool.slug, tool])
) as Record<ToolMetadata['slug'], ToolMetadata>;

export const WEBHOOK_TESTER_TOOL = TOOL_MAP['webhook-tester'];
export const JWT_DEBUGGER_TOOL = TOOL_MAP['jwt-debugger'];
export const JSON_FORMATTER_TOOL = TOOL_MAP['json-formatter'];
export const HMAC_GENERATOR_TOOL = TOOL_MAP['hmac-generator'];
