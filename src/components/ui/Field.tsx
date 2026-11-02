import React from 'react';
import { cn } from '../../utils/cn';

export const inputClass =
'w-full rounded-lg border border-edge bg-night px-3 py-2.5 text-sm text-fg placeholder:text-subtle transition-[border-color,box-shadow] duration-150 focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/15 disabled:opacity-60';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, hint, required, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted">
        {label}
        {required && <span className="ml-0.5 text-gold">*</span>}
      </label>
      {children}
      {error ?
      <p role="alert" className="text-xs text-danger">
          {error}
        </p> :
      hint ?
      <p className="text-xs text-subtle">{hint}</p> :
      null}
    </div>);

}