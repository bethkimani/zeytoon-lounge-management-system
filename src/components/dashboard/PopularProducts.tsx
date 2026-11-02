import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Sale } from '../../types/models';
import { popularProducts, salesInPeriod } from '../../utils/metrics';
import { ChartTooltip } from '../charts/ChartTooltip';
import { Panel } from '../ui/Panel';

export function PopularProducts({ sales }: {sales: Sale[];}) {
  const data = popularProducts(salesInPeriod(sales, 'month'), 6);
  return (
    <Panel title="Popular products" description="By revenue, this month">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#A8A8A8', fontSize: 11 }} />
            
            <Tooltip content={<ChartTooltip currency />} cursor={{ fill: 'rgba(212,175,55,0.06)' }} />
            <Bar dataKey="revenue" name="Revenue" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>);

}