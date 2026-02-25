import { Panel } from '@/components/common/Panel';
import type { FaqItem } from '@/lib/seo';

export const faqItems: FaqItem[] = [
  {
    question: 'What is a webhook tester?',
    answer:
      'A webhook tester gives you a temporary URL so you can send webhook calls and inspect the incoming request payload, headers, and metadata during development.'
  },
  {
    question: 'Is this tool free?',
    answer:
      'Yes. Webhook Tester on DeveloperTools.dev is a free developer utility for generating temporary webhook endpoints and inspecting requests.'
  },
  {
    question: 'How long are requests stored?',
    answer:
      'Requests are intended to be temporary and auto-expiring. This demo UI uses mock data only and does not persist anything.'
  },
  {
    question: 'Can I use this for Stripe or Shopify testing?',
    answer:
      'Yes. A webhook tester is useful for Stripe, Shopify, GitHub, and other providers when you need to validate request shape, headers, and payload content.'
  }
];

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading">
      <Panel className="p-5">
        <h2 id="faq-heading" className="text-lg font-semibold text-text">
          FAQ
        </h2>
        <dl className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="rounded-md border border-border bg-slate-900/40 p-3"
            >
              <dt className="text-sm font-medium text-text">{item.question}</dt>
              <dd className="mt-2 text-sm leading-6 text-slate-300">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
    </section>
  );
}
