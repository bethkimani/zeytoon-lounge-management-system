import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Sale } from '../../types/models';
import { formatCompactKES, formatKES } from '../../utils/format';
import { revenueByWeek } from '../../utils/metrics';
import { ChartTooltip } from '../charts/ChartTooltip';
import { Panel } from '../ui/Panel';

export function WeeklyRevenueChart({ sales }: {sales: Sale[];}) {
  const data = revenueByWeek(sales, 8);
  const thisWeek = data[data.length - 1]?.total ?? 0;
  return (
    <Panel title="Weekly revenue" description={`This week so far: ${formatKES(thisWeek)}`}>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#262626" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(v: number) => formatCompactKES(v).replace('KES ', '')} tickLine={false} axisLine={false} width={48} />
            <Tooltip content={<ChartTooltip currency />} cursor={{ fill: 'rgba(212,175,55,0.06)' }} />
            <Bar dataKey="total" name="Revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>);

}