import { Panel } from '@/components/common/Panel';
import type { FaqItem } from '@/lib/seo';

interface ToolFaqSectionProps {
  headingId: string;
  items: FaqItem[];
}

export function ToolFaqSection({ headingId, items }: ToolFaqSectionProps) {
  return (
    <section aria-labelledby={headingId}>
      <Panel className="p-6">
        <div className="space-y-4">
          <h2 id={headingId} className="text-xl font-semibold tracking-tight text-text">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.question} className="space-y-1">
                <h3 className="text-base font-semibold text-slate-100">{item.question}</h3>
                <p className="text-sm leading-6 text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </Panel>
    </section>
  );
}
