export type ToolStatus = 'active' | 'coming-soon';

export interface ToolMetadata {
  slug:
    | 'webhook-tester'
    | 'jwt-debugger'
    | 'json-formatter'
    | 'hmac-generator'
    | 'regex-tester'
    | 'base64-encoder-decoder'
    | 'url-encoder-decoder'
    | 'uuid-generator'
    | 'timestamp-converter'
    | 'cron-expression-parser'
    | 'json-diff'
    | 'json-schema-validator'
    | 'openapi-validator'
    | 'curl-to-fetch'
    | 'sql-formatter'
    | 'xml-to-json'
    | 'csv-to-json'
    | 'json-to-typescript'
    | 'ulid-generator'
    | 'env-parser';
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
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    routePath: '/regex-tester',
    status: 'coming-soon',
    shortDescription:
      'Test regular expressions with live match previews and flags.',
    seoTitle: 'Regex Tester (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'Regex Tester is coming soon to DeveloperKit.dev. Test regular expressions with flags, groups, and live matches.',
    jsonLdDescription:
      'Regex Tester for evaluating regular expressions and debugging matches. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Test regular expressions, flags, and match groups in a fast developer-friendly interface.'
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    routePath: '/base64-encoder-decoder',
    status: 'coming-soon',
    shortDescription:
      'Encode and decode Base64 strings for payload and token debugging.',
    seoTitle: 'Base64 Encoder/Decoder (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'Base64 Encoder/Decoder is coming soon to DeveloperKit.dev. Encode and decode Base64 values for API and auth workflows.',
    jsonLdDescription:
      'Base64 encoder and decoder for developer payload and token workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Encode and decode Base64 content quickly for API payload and token debugging workflows.'
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder/Decoder',
    routePath: '/url-encoder-decoder',
    status: 'coming-soon',
    shortDescription:
      'Encode and decode URL components for query and form data.',
    seoTitle: 'URL Encoder/Decoder (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'URL Encoder/Decoder is coming soon to DeveloperKit.dev. Encode and decode URL strings and query parameters quickly.',
    jsonLdDescription:
      'URL encoder and decoder for query strings and form data. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Encode and decode URL strings and query components for web and API debugging.'
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    routePath: '/uuid-generator',
    status: 'coming-soon',
    shortDescription:
      'Generate UUIDs for IDs, fixtures, and test data quickly.',
    seoTitle: 'UUID Generator (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'UUID Generator is coming soon to DeveloperKit.dev. Generate unique identifiers for testing and development.',
    jsonLdDescription:
      'UUID generator for creating unique IDs in developer workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Generate UUIDs instantly for testing, fixtures, and application data workflows.'
  },
  {
    slug: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    routePath: '/timestamp-converter',
    status: 'coming-soon',
    shortDescription:
      'Convert Unix timestamps to human-readable dates and back.',
    seoTitle: 'Unix Timestamp Converter (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'Unix Timestamp Converter is coming soon to DeveloperKit.dev. Convert timestamps to readable dates and back.',
    jsonLdDescription:
      'Unix timestamp converter for date and time debugging workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Convert Unix timestamps and readable dates for logs, APIs, and debugging workflows.'
  },
  {
    slug: 'cron-expression-parser',
    name: 'Cron Expression Parser',
    routePath: '/cron-expression-parser',
    status: 'coming-soon',
    shortDescription:
      'Parse cron expressions and understand schedule timing quickly.',
    seoTitle: 'Cron Expression Parser (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'Cron Expression Parser is coming soon to DeveloperKit.dev. Parse cron expressions and inspect schedule details.',
    jsonLdDescription:
      'Cron expression parser for scheduling and automation workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Parse cron expressions and inspect schedule behavior for automation and job scheduling.'
  },
  {
    slug: 'json-diff',
    name: 'JSON Diff',
    routePath: '/json-diff',
    status: 'coming-soon',
    shortDescription:
      'Compare two JSON objects and inspect added, removed, and changed keys.',
    seoTitle: 'JSON Diff (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'JSON Diff is coming soon to DeveloperKit.dev. Compare JSON payloads and inspect precise object-level differences.',
    jsonLdDescription:
      'JSON diff tool for comparing payload changes. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Compare two JSON payloads and quickly identify key-level differences.'
  },
  {
    slug: 'json-schema-validator',
    name: 'JSON Schema Validator',
    routePath: '/json-schema-validator',
    status: 'coming-soon',
    shortDescription:
      'Validate JSON payloads against JSON Schema definitions.',
    seoTitle: 'JSON Schema Validator (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'JSON Schema Validator is coming soon to DeveloperKit.dev. Validate JSON documents against schema rules and constraints.',
    jsonLdDescription:
      'JSON Schema validator for API payload validation workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Validate JSON payloads against JSON Schema definitions and inspect validation errors.'
  },
  {
    slug: 'openapi-validator',
    name: 'OpenAPI Validator',
    routePath: '/openapi-validator',
    status: 'coming-soon',
    shortDescription:
      'Validate and lint OpenAPI specs for API design and integration workflows.',
    seoTitle: 'OpenAPI Validator (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'OpenAPI Validator is coming soon to DeveloperKit.dev. Validate OpenAPI specs and identify structural issues quickly.',
    jsonLdDescription:
      'OpenAPI validator for API contract quality checks. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Validate and inspect OpenAPI documents for contract and schema quality checks.'
  },
  {
    slug: 'curl-to-fetch',
    name: 'cURL to Fetch Converter',
    routePath: '/curl-to-fetch',
    status: 'coming-soon',
    shortDescription:
      'Convert cURL commands to browser fetch code for quick integration.',
    seoTitle: 'cURL to Fetch Converter (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'cURL to Fetch Converter is coming soon to DeveloperKit.dev. Convert terminal cURL commands into fetch snippets.',
    jsonLdDescription:
      'cURL to fetch converter for API integration workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Convert cURL requests into clean fetch() code for frontend and API integration.'
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    routePath: '/sql-formatter',
    status: 'coming-soon',
    shortDescription:
      'Format and beautify SQL queries for readability and review.',
    seoTitle: 'SQL Formatter (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'SQL Formatter is coming soon to DeveloperKit.dev. Format SQL queries with cleaner structure for debugging and reviews.',
    jsonLdDescription:
      'SQL formatter for query readability and debugging. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Format SQL queries into readable, review-friendly statements.'
  },
  {
    slug: 'xml-to-json',
    name: 'XML to JSON Converter',
    routePath: '/xml-to-json',
    status: 'coming-soon',
    shortDescription:
      'Convert XML documents into JSON for modern API workflows.',
    seoTitle: 'XML to JSON Converter (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'XML to JSON Converter is coming soon to DeveloperKit.dev. Convert XML payloads to JSON for integration and migration tasks.',
    jsonLdDescription:
      'XML to JSON converter for API and data transformation workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Convert XML payloads to JSON to simplify modern API and data workflows.'
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON Converter',
    routePath: '/csv-to-json',
    status: 'coming-soon',
    shortDescription:
      'Convert CSV data to JSON for APIs, scripts, and test fixtures.',
    seoTitle: 'CSV to JSON Converter (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'CSV to JSON Converter is coming soon to DeveloperKit.dev. Transform CSV files into JSON for APIs and developer tooling.',
    jsonLdDescription:
      'CSV to JSON converter for data transformation workflows. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Convert CSV rows into structured JSON for APIs, imports, and automation.'
  },
  {
    slug: 'json-to-typescript',
    name: 'JSON to TypeScript',
    routePath: '/json-to-typescript',
    status: 'coming-soon',
    shortDescription:
      'Generate TypeScript interfaces from JSON sample payloads.',
    seoTitle: 'JSON to TypeScript (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'JSON to TypeScript is coming soon to DeveloperKit.dev. Generate TypeScript types from sample JSON payloads.',
    jsonLdDescription:
      'JSON to TypeScript converter for typed API development. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Generate TypeScript interfaces from JSON examples to speed up typed development.'
  },
  {
    slug: 'ulid-generator',
    name: 'ULID Generator',
    routePath: '/ulid-generator',
    status: 'coming-soon',
    shortDescription:
      'Generate lexicographically sortable ULIDs for distributed systems.',
    seoTitle: 'ULID Generator (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      'ULID Generator is coming soon to DeveloperKit.dev. Generate sortable unique IDs for logs, events, and distributed workflows.',
    jsonLdDescription:
      'ULID generator for sortable unique identifiers. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Generate ULIDs for sortable, globally unique identifiers in distributed systems.'
  },
  {
    slug: 'env-parser',
    name: '.env Parser',
    routePath: '/env-parser',
    status: 'coming-soon',
    shortDescription:
      'Parse and validate .env files for configuration debugging.',
    seoTitle: '.env Parser (Coming Soon) | DeveloperKit.dev',
    seoDescription:
      '.env Parser is coming soon to DeveloperKit.dev. Parse .env files and inspect configuration keys safely.',
    jsonLdDescription:
      '.env parser for configuration and deployment debugging. Coming soon on DeveloperKit.dev.',
    pageIntro:
      'Parse and inspect .env configuration files for development and deployment workflows.'
  }
];

export const TOOL_MAP: Record<ToolMetadata['slug'], ToolMetadata> = Object.fromEntries(
  TOOLS.map((tool) => [tool.slug, tool])
) as Record<ToolMetadata['slug'], ToolMetadata>;

export const WEBHOOK_TESTER_TOOL = TOOL_MAP['webhook-tester'];
export const JWT_DEBUGGER_TOOL = TOOL_MAP['jwt-debugger'];
export const JSON_FORMATTER_TOOL = TOOL_MAP['json-formatter'];
export const HMAC_GENERATOR_TOOL = TOOL_MAP['hmac-generator'];
export const REGEX_TESTER_TOOL = TOOL_MAP['regex-tester'];
export const BASE64_ENCODER_DECODER_TOOL = TOOL_MAP['base64-encoder-decoder'];
export const URL_ENCODER_DECODER_TOOL = TOOL_MAP['url-encoder-decoder'];
export const UUID_GENERATOR_TOOL = TOOL_MAP['uuid-generator'];
export const TIMESTAMP_CONVERTER_TOOL = TOOL_MAP['timestamp-converter'];
export const CRON_EXPRESSION_PARSER_TOOL = TOOL_MAP['cron-expression-parser'];
export const JSON_DIFF_TOOL = TOOL_MAP['json-diff'];
export const JSON_SCHEMA_VALIDATOR_TOOL = TOOL_MAP['json-schema-validator'];
export const OPENAPI_VALIDATOR_TOOL = TOOL_MAP['openapi-validator'];
export const CURL_TO_FETCH_TOOL = TOOL_MAP['curl-to-fetch'];
export const SQL_FORMATTER_TOOL = TOOL_MAP['sql-formatter'];
export const XML_TO_JSON_TOOL = TOOL_MAP['xml-to-json'];
export const CSV_TO_JSON_TOOL = TOOL_MAP['csv-to-json'];
export const JSON_TO_TYPESCRIPT_TOOL = TOOL_MAP['json-to-typescript'];
export const ULID_GENERATOR_TOOL = TOOL_MAP['ulid-generator'];
export const ENV_PARSER_TOOL = TOOL_MAP['env-parser'];
