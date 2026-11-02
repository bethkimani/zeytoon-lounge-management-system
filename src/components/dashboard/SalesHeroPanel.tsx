import React from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRightIcon } from 'lucide-react';
import type { Sale } from '../../types/models';
import { formatCompactKES, formatKES } from '../../utils/format';
import { salesByDay, salesInPeriod, sumSales } from '../../utils/metrics';
import { ChartTooltip } from '../charts/ChartTooltip';

interface SalesHeroPanelProps {
  sales: Sale[];
}

export function SalesHeroPanel({ sales }: SalesHeroPanelProps) {
  const today = salesInPeriod(sales, 'day');
  const todayTotal = sumSales(today);
  const daily = salesByDay(sales, 14);
  const lastWeekSameDay = daily[daily.length - 8]?.total ?? 0;
  const change = lastWeekSameDay ? (todayTotal - lastWeekSameDay) / lastWeekSameDay * 100 : 0;
  const avgTicket = today.length ? todayTotal / today.length : 0;

  return (
    <section className="rounded-2xl border border-gold/20 bg-charcoal p-5 md:p-6" aria-labelledby="today-sales">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="today-sales" className="text-sm text-muted">Today’s sales</h2>
          <p className="mt-1 font-display text-5xl font-semibold tracking-tight text-fg md:text-6xl">{formatKES(todayTotal)}</p>
          <p className="mt-2 text-sm text-muted">
            <span className={change >= 0 ? 'text-ok' : 'text-danger'}>
              {change >= 0 ? '+' : ''}
              {change.toFixed(0)}%
            </span>{' '}
            vs same day last week · {today.length} transactions · avg {formatKES(avgTicket)}
          </p>
        </div>
        <Link to="/admin/sales" className="inline-flex items-center gap-1 text-sm text-gold hover:text-gold-soft">
          Sales report <ArrowUpRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 h-48" aria-label="Daily sales for the last 14 days">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={daily} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#262626" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval={1} />
            <YAxis tickFormatter={(v: number) => formatCompactKES(v).replace('KES ', '')} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<ChartTooltip currency />} cursor={{ stroke: '#D4AF37', strokeOpacity: 0.3 }} />
            <Area type="monotone" dataKey="total" name="Sales" stroke="#D4AF37" strokeWidth={2} fill="#D4AF37" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>);

}