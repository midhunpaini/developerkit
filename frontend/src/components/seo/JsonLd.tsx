import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  data: object | object[];
}

export function JsonLd({ data }: JsonLdProps) {
  const payloads = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {payloads.map((payload, index) => (
        <script
          key={index}
          type="application/ld+json"
        >
          {JSON.stringify(payload)}
        </script>
      ))}
    </Helmet>
  );
}
