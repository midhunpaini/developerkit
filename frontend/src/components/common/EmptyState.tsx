import type { ReactNode } from 'react';

import { Panel } from '@/components/common/Panel';

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <Panel className="p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        {description ? (
          <p className="text-sm text-slate-300">{description}</p>
        ) : null}
        {children}
      </div>
    </Panel>
  );
}
