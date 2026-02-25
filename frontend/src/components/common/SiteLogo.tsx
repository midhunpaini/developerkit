import { cn } from '@/lib/cn';

interface SiteLogoProps {
  className?: string;
  compact?: boolean;
}

export function SiteLogo({ className, compact = false }: SiteLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img
        src="/logo-mark.svg"
        alt=""
        aria-hidden="true"
        width={compact ? 20 : 24}
        height={compact ? 20 : 24}
        className={cn(compact ? 'h-5 w-5' : 'h-6 w-6', 'shrink-0')}
      />
      <span
        className={cn(
          'tracking-tight text-text',
          compact ? 'text-sm font-semibold' : 'text-base font-semibold'
        )}
      >
        DeveloperTools.dev
      </span>
    </span>
  );
}
