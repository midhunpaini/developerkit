import { Panel } from '@/components/common/Panel';

const FEATURES = [
  'Real-time request capture',
  'JSON viewer',
  'Copy as cURL',
  'No login required',
  'Auto-expiring endpoints'
] as const;

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading">
      <Panel className="p-5">
        <h2 id="features-heading" className="text-lg font-semibold text-text">
          Features
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="rounded-md border border-border bg-slate-900/40 px-3 py-2 text-sm text-slate-200"
            >
              {feature}
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}
