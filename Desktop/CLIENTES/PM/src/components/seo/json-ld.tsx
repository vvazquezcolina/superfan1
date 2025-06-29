// src/components/seo/json-ld.tsx
import type { Thing, WithContext } from 'schema-dts';

interface JsonLdProps<T extends Thing> {
  schema: WithContext<T>;
}

export default function JsonLd<T extends Thing>({ schema }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      key={`json-ld-${schema['@type']}`}
    />
  );
}
