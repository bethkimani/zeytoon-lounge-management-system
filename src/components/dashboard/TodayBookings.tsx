import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarXIcon } from 'lucide-react';
import type { LoungeTable, Reservation } from '../../types/models';
import { formatTime, todayISO } from '../../utils/format';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';

interface TodayBookingsProps {
  reservations: Reservation[];
  tables: LoungeTable[];
}

export function TodayBookings({ reservations, tables }: TodayBookingsProps) {
  const today = reservations.
  filter((r) => r.date === todayISO() && r.status !== 'Cancelled').
  sort((a, b) => a.time.localeCompare(b.time));
  const guests = today.reduce((s, r) => s + r.guests, 0);

  return (
    <section className="flex flex-col rounded-2xl border border-edge bg-charcoal" aria-labelledby="today-bookings">
      <header className="flex items-end justify-between px-5 pt-5">
        <div>
          <h2 id="today-bookings" className="text-sm text-muted">Today’s bookings</h2>
          <p className="mt-1 font-display text-4xl font-semibold">
            {today.length} <span className="font-sans text-sm font-normal text-subtle">· {guests} guests</span>
          </p>
        </div>
        <Link to="/admin/reservations" className="text-sm text-gold hover:text-gold-soft">View all</Link>
      </header>
      {today.length === 0 ?
      <EmptyState icon={CalendarXIcon} title="No bookings today" description="New reservations will appear here." /> :

      <ul className="mt-4 flex-1 divide-y divide-edge px-5 pb-3">
          {today.slice(0, 5).map((r) =>
        <li key={r.id} className="flex items-center gap-3 py-3">
              <span className="w-[68px] shrink-0 text-sm font-medium tabular-nums text-gold">{formatTime(r.time)}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-fg">{r.customerName}</p>
                <p className="text-xs text-subtle">
                  {r.guests} guests · Table {tables.find((t) => t.id === r.tableId)?.number}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </li>
        )}
        </ul>
      }
    </section>);

}