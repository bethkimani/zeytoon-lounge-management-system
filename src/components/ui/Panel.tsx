import React from 'react';
import { cn } from '../../utils/cn';

interface PanelProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

export function Panel({ title, description, action, className, bodyClassName, children }: PanelProps) {
  return (
    <section className={cn('rounded-2xl border border-edge bg-charcoal', className)}>
      {(title || action) &&
      <header className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            {title && <h2 className="text-sm font-semibold text-fg">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-subtle">{description}</p>}
          </div>
          {action}
        </header>
      }
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>);

}