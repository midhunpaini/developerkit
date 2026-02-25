import { Helmet } from 'react-helmet-async';

import { SITE_CONFIG } from '@/config/site';

import { JsonLd } from '@/components/seo/JsonLd';

interface SeoImageFields {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
}

interface TwitterFields {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
}

export interface SeoMetaProps {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  openGraph?: SeoImageFields;
  twitter?: TwitterFields;
  jsonLd?: object | object[];
}

export function SeoMeta({
  title,
  description,
  canonical,
  robots,
  openGraph,
  twitter,
  jsonLd
}: SeoMetaProps) {
  const og = {
    title,
    description,
    type: 'website',
    image: SITE_CONFIG.defaultOgImage,
    ...openGraph
  };

  const twitterMeta = {
    card: 'summary_large_image',
    title: og.title,
    description: og.description,
    image: og.image,
    ...twitter
  };

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content={SITE_CONFIG.brandColor} />
        {robots ? <meta name="robots" content={robots} /> : null}
        {canonical ? <link rel="canonical" href={canonical} /> : null}

        <meta property="og:title" content={og.title} />
        <meta property="og:description" content={og.description} />
        <meta property="og:type" content={og.type} />
        {og.url ? <meta property="og:url" content={og.url} /> : null}
        {og.image ? <meta property="og:image" content={og.image} /> : null}
        <meta property="og:site_name" content={SITE_CONFIG.siteName} />

        <meta name="twitter:card" content={twitterMeta.card} />
        <meta name="twitter:title" content={twitterMeta.title} />
        <meta name="twitter:description" content={twitterMeta.description} />
        {twitterMeta.image ? (
          <meta name="twitter:image" content={twitterMeta.image} />
        ) : null}
      </Helmet>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
    </>
  );
}
