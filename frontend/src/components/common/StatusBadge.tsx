import { cn } from '@/lib/cn';

interface StatusBadgeProps {
  statusCode: number;
  className?: string;
}

export function StatusBadge({ statusCode, className }: StatusBadgeProps) {
  const colorClass =
    statusCode >= 400
      ? 'border-error/40 bg-error/10 text-error'
      : statusCode >= 300
        ? 'border-primary/40 bg-primary/10 text-primary'
        : 'border-success/40 bg-success/10 text-success';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums',
        colorClass,
        className
      )}
    >
      {statusCode}
    </span>
  );
}
