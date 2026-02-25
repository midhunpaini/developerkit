import type { HttpMethod } from '@/features/webhooks/types';

export function getMethodBadgeClass(method: HttpMethod) {
  switch (method) {
    case 'POST':
      return 'border-primary/40 bg-primary/10 text-primary';
    case 'GET':
      return 'border-success/40 bg-success/10 text-success';
    case 'PUT':
    case 'PATCH':
      return 'border-sky-400/40 bg-sky-400/10 text-sky-300';
    case 'DELETE':
      return 'border-error/40 bg-error/10 text-error';
    default:
      return 'border-border bg-slate-900/60 text-slate-200';
  }
}

export function getSortedHeaderEntries(headers: Record<string, string>) {
  return Object.entries(headers).sort(([a], [b]) => a.localeCompare(b));
}
