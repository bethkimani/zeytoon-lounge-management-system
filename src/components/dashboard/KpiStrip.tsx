import React from 'react';

interface Kpi {
  label: string;
  value: string | number;
  hint: string;
}

interface KpiStripProps {
  items: Kpi[];
}

export function KpiStrip({ items }: KpiStripProps) {
  return (
    <dl className="grid grid-cols-2 rounded-2xl border border-edge bg-charcoal md:grid-cols-4">
      {items.map((kpi, i) =>
      <div
        key={kpi.label}
        className={[
        'px-5 py-4',
        i % 2 === 1 ? 'border-l border-edge' : '',
        i >= 2 ? 'border-t border-edge md:border-t-0' : '',
        i === 2 ? 'md:border-l' : ''].
        join(' ')}>
        
          <dt className="text-xs text-muted">{kpi.label}</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-fg">{kpi.value}</dd>
          <dd className="mt-0.5 text-xs text-subtle">{kpi.hint}</dd>
        </div>
      )}
    </dl>);

}