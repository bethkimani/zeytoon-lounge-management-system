import React from 'react';
import { formatKES } from '../../utils/format';

interface TooltipPayload {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  currency?: boolean;
}

export function ChartTooltip({ active, payload, label, currency = false }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gold/25 bg-night/95 px-3 py-2 text-xs shadow-xl">
      {label && <p className="mb-1 font-medium text-fg">{label}</p>}
      {payload.map((p) =>
      <p key={String(p.dataKey)} className="flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
          {p.name}: <span className="font-medium text-fg">{currency ? formatKES(p.value ?? 0) : p.value}</span>
        </p>
      )}
    </div>);

}