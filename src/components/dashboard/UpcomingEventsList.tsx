import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlusIcon } from 'lucide-react';
import type { LoungeEvent } from '../../types/models';
import { formatDate, formatKES, formatTime, todayISO } from '../../utils/format';
import { EmptyState } from '../ui/EmptyState';

export function UpcomingEventsList({ events }: {events: LoungeEvent[];}) {
  const upcoming = events.
  filter((e) => e.date >= todayISO() && (e.status === 'Upcoming' || e.status === 'Sold Out')).
  sort((a, b) => a.date.localeCompare(b.date)).
  slice(0, 4);

  return (
    <section className="rounded-2xl border border-edge bg-charcoal" aria-labelledby="upcoming-events">
      <header className="flex items-center justify-between px-5 pt-5">
        <h2 id="upcoming-events" className="text-sm font-semibold text-fg">Upcoming events</h2>
        <Link to="/admin/events" className="text-sm text-gold hover:text-gold-soft">Manage</Link>
      </header>
      {upcoming.length === 0 ?
      <EmptyState icon={CalendarPlusIcon} title="No upcoming events" /> :

      <ul className="space-y-1 p-3">
          {upcoming.map((e) =>
        <li key={e.id} className="flex items-center gap-3 rounded-xl p-2">
              <img src={e.image} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-fg">{e.name}</p>
                <p className="text-xs text-subtle">
                  {formatDate(e.date, 'EEE d MMM')} · {formatTime(e.startTime)}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted">{e.status === 'Sold Out' ? 'Sold out' : e.ticketPrice ? formatKES(e.ticketPrice) : 'Free'}</span>
            </li>
        )}
        </ul>
      }
    </section>);

}