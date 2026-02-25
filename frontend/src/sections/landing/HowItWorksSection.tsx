import { Panel } from '@/components/common/Panel';

const STEPS = [
  'Generate endpoint',
  'Send request',
  'Inspect payload'
] as const;

export function HowItWorksSection() {
  return (
    <section aria-labelledby="how-it-works-heading">
      <Panel className="p-5">
        <h2 id="how-it-works-heading" className="text-lg font-semibold text-text">
          How it works
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="rounded-md border border-border bg-slate-900/40 p-3"
            >
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm text-text">{step}</p>
            </li>
          ))}
        </ol>
      </Panel>
    </section>
  );
}
