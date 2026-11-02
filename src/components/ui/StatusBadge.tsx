import React from 'react';
import { cn } from '../../utils/cn';

type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'gold' | 'muted';

const statusTones: Record<string, Tone> = {
  Pending: 'warn',
  Confirmed: 'ok',
  Cancelled: 'danger',
  Completed: 'info',
  Available: 'ok',
  Reserved: 'warn',
  Occupied: 'danger',
  Upcoming: 'ok',
  'Sold Out': 'gold',
  Draft: 'muted',
  Active: 'ok',
  'On Leave': 'warn',
  Inactive: 'muted',
  'Low stock': 'danger',
  'In stock': 'ok',
  'Out of stock': 'danger',
  VIP: 'gold',
  Regular: 'muted',
  Received: 'ok',
  Issued: 'info'
};

const toneClasses: Record<Tone, string> = {
  ok: 'bg-ok/10 text-ok border-ok/25',
  warn: 'bg-warn/10 text-warn border-warn/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
  info: 'bg-info/10 text-info border-info/25',
  gold: 'bg-gold/10 text-gold border-gold/30',
  muted: 'bg-white/5 text-muted border-edge'
};

const dotClasses: Record<Tone, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  danger: 'bg-danger',
  info: 'bg-info',
  gold: 'bg-gold',
  muted: 'bg-subtle'
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const tone = statusTones[status] ?? 'muted';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className
      )}>
      
      <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} aria-hidden="true" />
      {status}
    </span>);

}

export function statusTone(status: string): Tone {
  return statusTones[status] ?? 'muted';
}