import React from 'react';
import { cn } from '../../utils/cn';

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

export function Segmented<T extends string>({ options, value, onChange, label, className }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex max-w-full overflow-x-auto rounded-lg border border-edge bg-night p-0.5', className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors duration-150',
              active ? 'bg-gold/15 text-gold' : 'text-muted hover:text-fg'
            )}>
            
            {o.label}
            {o.count !== undefined && <span className={cn('tabular-nums', active ? 'text-gold/80' : 'text-subtle')}>{o.count}</span>}
          </button>);

      })}
    </div>);

}