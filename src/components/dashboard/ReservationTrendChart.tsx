import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Reservation } from '../../types/models';
import { reservationTrend } from '../../utils/metrics';
import { ChartTooltip } from '../charts/ChartTooltip';
import { Panel } from '../ui/Panel';

export function ReservationTrendChart({ reservations }: {reservations: Reservation[];}) {
  const data = reservationTrend(reservations, -6, 7);
  return (
    <Panel title="Reservation trends" description="Past 6 days to next 7 days">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="#262626" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval={1} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={36} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(212,175,55,0.06)' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#A8A8A8' }} />
            <Bar dataKey="Confirmed" stackId="a" fill="#D4AF37" maxBarSize={22} />
            <Bar dataKey="Pending" stackId="a" fill="#8C7425" maxBarSize={22} />
            <Bar dataKey="Completed" stackId="a" fill="#5A5A5A" maxBarSize={22} />
            <Bar dataKey="Cancelled" stackId="a" fill="#E06C5A" radius={[3, 3, 0, 0]} maxBarSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>);

}