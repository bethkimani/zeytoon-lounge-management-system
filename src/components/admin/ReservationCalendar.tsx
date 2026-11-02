import React, { useMemo, useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths } from
'date-fns';
import { CalendarPlusIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { LoungeTable, Reservation } from '../../types/models';
import { formatDate, formatTime, toISODate, todayISO } from '../../utils/format';
import { cn } from '../../utils/cn';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

interface ReservationCalendarProps {
  reservations: Reservation[];
  tables: LoungeTable[];
  onSelect: (r: Reservation) => void;
  onCreate: (date: string) => void;
}

const dotColor: Record<string, string> = {
  Confirmed: 'bg-ok',
  Pending: 'bg-warn',
  Completed: 'bg-info',
  Cancelled: 'bg-danger'
};

export function ReservationCalendar({ reservations, tables, onSelect, onCreate }: ReservationCalendarProps) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(todayISO());

  const days = useMemo(
    () =>
    eachDayOfInterval({
      start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    }),
    [month]
  );

  const byDate = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    reservations.forEach((r) => map.set(r.date, [...(map.get(r.date) ?? []), r]));
    map.forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [reservations]);

  const selectedList = byDate.get(selected) ?? [];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="rounded-2xl border border-edge bg-charcoal p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">{format(month, 'MMMM yyyy')}</h2>
          <div className="flex gap-1">
            <button type="button" aria-label="Previous month" onClick={() => setMonth((m) => subMonths(m, 1))} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-fg">
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => {setMonth(startOfMonth(new Date()));setSelected(todayISO());}} className="rounded-lg px-3 text-xs text-muted hover:bg-white/5 hover:text-fg">
              Today
            </button>
            <button type="button" aria-label="Next month" onClick={() => setMonth((m) => addMonths(m, 1))} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-fg">
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-subtle">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) =>
          <div key={d} className="pb-2">{d}</div>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = toISODate(day);
            const list = byDate.get(key) ?? [];
            const isSelected = key === selected;
            const isToday = key === todayISO();
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                aria-pressed={isSelected}
                aria-label={`${format(day, 'd MMMM')}, ${list.length} reservations`}
                className={cn(
                  'flex min-h-[64px] flex-col items-start rounded-lg border p-1.5 text-left transition-colors duration-150 sm:min-h-[84px] sm:p-2',
                  isSelected ? 'border-gold/60 bg-gold/10' : 'border-transparent hover:bg-white/[0.03]',
                  !isSameMonth(day, month) && 'opacity-40'
                )}>
                
                <span className={cn('text-xs tabular-nums', isToday ? 'flex h-5 w-5 items-center justify-center rounded-full bg-gold font-semibold text-night' : 'text-muted')}>
                  {format(day, 'd')}
                </span>
                {list.length > 0 &&
                <>
                    <div className="mt-auto flex flex-wrap gap-0.5">
                      {list.slice(0, 6).map((r) =>
                    <span key={r.id} className={cn('h-1.5 w-1.5 rounded-full', dotColor[r.status])} />
                    )}
                    </div>
                    <span className="mt-1 hidden text-[11px] text-fg sm:block">{list.length} booking{list.length > 1 ? 's' : ''}</span>
                  </>
                }
              </button>);

          })}
        </div>
      </div>

      <div className="rounded-2xl border border-edge bg-charcoal">
        <div className="flex items-center justify-between border-b border-edge px-4 py-3">
          <div>
            <p className="text-sm font-semibold">{formatDate(selected, 'EEEE, d MMM')}</p>
            <p className="text-xs text-subtle">{selectedList.length} reservation{selectedList.length === 1 ? '' : 's'}</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => onCreate(selected)}>
            <CalendarPlusIcon className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {selectedList.length === 0 ?
        <EmptyState icon={CalendarPlusIcon} title="No reservations" description="This day is open for bookings." /> :

        <ul className="divide-y divide-edge">
            {selectedList.map((r) =>
          <li key={r.id}>
                <button type="button" onClick={() => onSelect(r)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]">
                  <span className="w-[68px] shrink-0 text-sm tabular-nums text-gold">{formatTime(r.time)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-fg">{r.customerName}</span>
                    <span className="block text-xs text-subtle">{r.guests} guests · Table {tables.find((t) => t.id === r.tableId)?.number}</span>
                  </span>
                  <StatusBadge status={r.status} />
                </button>
              </li>
          )}
          </ul>
        }
      </div>
    </div>);

}