import React from 'react';
import { Link } from 'react-router-dom';
import type { LoungeEvent } from '../../types/models';
import { formatDate, formatKES, formatTime } from '../../utils/format';

export function PublicEventCard({ event }: {event: LoungeEvent;}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gold/15 bg-charcoal">
      <div className="relative overflow-hidden">
        <img src={event.image} alt={event.name} className="h-56 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        <div className="absolute left-4 top-4 rounded-xl bg-night/85 px-3 py-2 text-center">
          <p className="font-display text-2xl font-semibold leading-none text-gold">{formatDate(event.date, 'd')}</p>
          <p className="text-[11px] uppercase tracking-wider text-fg/80">{formatDate(event.date, 'MMM')}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-gold">{event.category}</p>
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{event.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{event.description}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm">
          <span className="text-muted">{formatDate(event.date, 'EEE')} · {formatTime(event.startTime)}</span>
          {event.status === 'Sold Out' ?
          <span className="font-medium text-subtle">Sold out</span> :

          <Link to="/reservations" className="font-medium text-gold hover:text-gold-soft">
              {event.ticketPrice ? formatKES(event.ticketPrice) : 'Free entry'} →
            </Link>
          }
        </div>
      </div>
    </article>);

}