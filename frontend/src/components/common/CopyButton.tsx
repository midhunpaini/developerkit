import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/common/Button';
import { copyTextToClipboard } from '@/lib/clipboard';
import { cn } from '@/lib/cn';

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  ariaLabel?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  ariaLabel,
  className,
  variant = 'secondary'
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await copyTextToClipboard(value);
      setCopied(true);
      setError(null);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch {
      setCopied(false);
      setError('Copy failed');
    }
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Button
        onClick={handleCopy}
        variant={variant}
        aria-label={ariaLabel ?? label}
      >
        {copied ? copiedLabel : label}
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? `${copiedLabel}.` : error ?? ''}
      </span>
    </div>
  );
}
