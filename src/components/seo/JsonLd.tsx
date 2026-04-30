// Renders a JSON-LD payload inside a `<script type="application/ld+json">` tag.
// JSON.stringify produces valid JSON, but a raw `<` in a string could close a
// `<script>` tag prematurely; escape it so the embedded payload stays safe.

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function safeJsonLd(payload: unknown): string {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script type="application/ld+json">{safeJsonLd(data)}</script>
  );
}
