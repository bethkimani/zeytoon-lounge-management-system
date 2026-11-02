import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CalendarIcon, ClockIcon, PencilIcon, PlusIcon, TicketIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import type { LoungeEvent } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { formatDate, formatKES, formatTime, todayISO } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Segmented } from '../../components/ui/Segmented';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DemoTag } from '../../components/ui/DemoTag';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EventForm } from '../../components/admin/EventForm';

type Filter = 'upcoming' | 'past' | 'all';

export function Events() {
  const { events, deleteEvent } = useData();
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LoungeEvent | null>(null);
  const [toDelete, setToDelete] = useState<LoungeEvent | null>(null);
  const today = todayISO();

  const list = useMemo(
    () =>
    events.
    filter((e) => filter === 'upcoming' ? e.date >= today : filter === 'past' ? e.date < today : true).
    sort((a, b) => filter === 'past' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)),
    [events, filter, today]
  );

  const [featured, ...rest] = list;
  const upcoming = events.filter((e) => e.date >= today && e.status !== 'Cancelled');
  const expected = upcoming.reduce((s, e) => s + e.expectedAttendance, 0);
  const potential = upcoming.reduce((s, e) => s + e.ticketPrice * e.expectedAttendance, 0);

  const edit = (e: LoungeEvent) => {
    setEditing(e);
    setFormOpen(true);
  };

  const Actions = ({ e }: {e: LoungeEvent;}) =>
  <div className="flex gap-1">
      <button type="button" onClick={() => edit(e)} aria-label={`Edit ${e.name}`} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-gold"><PencilIcon className="h-4 w-4" /></button>
      <button type="button" onClick={() => setToDelete(e)} aria-label={`Delete ${e.name}`} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-danger"><Trash2Icon className="h-4 w-4" /></button>
    </div>;


  return (
    <>
      <PageHeader
        title="Events"
        description={`${upcoming.length} upcoming · ${expected.toLocaleString()} expected guests · ${formatKES(potential)} potential ticket revenue`}
        actions={
        <>
            <Segmented<Filter>
            label="Filter events"
            value={filter}
            onChange={setFilter}
            options={[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
            { value: 'all', label: 'All' }]
            } />
          
            <Button onClick={() => {setEditing(null);setFormOpen(true);}}>
              <PlusIcon className="h-4 w-4" /> Create event
            </Button>
          </>
        } />
      

      {!featured ?
      <div className="rounded-2xl border border-edge bg-charcoal">
          <EmptyState icon={TicketIcon} title="No events here" description="Create an event to promote it on the website." />
        </div> :

      <div className="space-y-4">
          <article className="grid overflow-hidden rounded-2xl border border-gold/25 bg-charcoal md:grid-cols-[1.2fr_1fr]">
            <img src={featured.image} alt={featured.name} className="h-56 w-full object-cover md:h-full md:min-h-[300px]" />
            <div className="flex flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={featured.status} />
                <span className="text-xs text-muted">{featured.category}</span>
                {featured.isDemo && <DemoTag />}
              </div>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">{featured.name}</h2>
              <p className="mt-3 text-sm text-muted">{featured.description}</p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted"><CalendarIcon className="h-4 w-4 text-gold" /> {formatDate(featured.date, 'EEE d MMM')}</div>
                <div className="flex items-center gap-2 text-muted"><ClockIcon className="h-4 w-4 text-gold" /> {formatTime(featured.startTime)} – {formatTime(featured.endTime)}</div>
                <div className="flex items-center gap-2 text-muted"><TicketIcon className="h-4 w-4 text-gold" /> {featured.ticketPrice ? formatKES(featured.ticketPrice) : 'Free entry'}</div>
                <div className="flex items-center gap-2 text-muted"><UsersIcon className="h-4 w-4 text-gold" /> {featured.expectedAttendance} expected</div>
              </dl>
              <div className="mt-auto flex items-center justify-between pt-6">
                <p className="text-xs text-subtle">{filter === 'past' ? 'Most recent' : 'Next up'}</p>
                <Actions e={featured} />
              </div>
            </div>
          </article>

          {rest.length > 0 &&
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((e) =>
          <article key={e.id} className="flex flex-col overflow-hidden rounded-2xl border border-edge bg-charcoal">
                  <div className="relative">
                    <img src={e.image} alt={e.name} className="h-40 w-full object-cover" />
                    <div className="absolute left-3 top-3"><StatusBadge status={e.status} className="bg-night/80" /></div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="flex items-center gap-2 text-xs text-gold">{e.category} {e.isDemo && <DemoTag />}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{e.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{e.description}</p>
                    <p className="mb-4 mt-3 text-xs text-muted">
                      {formatDate(e.date, 'EEE d MMM')} · {formatTime(e.startTime)} – {formatTime(e.endTime)}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-edge pt-3">
                      <span className="text-sm">
                        <span className="font-medium text-fg">{e.ticketPrice ? formatKES(e.ticketPrice) : 'Free'}</span>
                        <span className="text-xs text-subtle"> · {e.expectedAttendance} guests</span>
                      </span>
                      <Actions e={e} />
                    </div>
                  </div>
                </article>
          )}
            </div>
        }
        </div>
      }

      <EventForm open={formOpen} onClose={() => setFormOpen(false)} event={editing} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete event?"
        message={toDelete ? `“${toDelete.name}” will be removed from the dashboard and public website.` : ''}
        onConfirm={() => {
          if (toDelete) {
            deleteEvent(toDelete.id);
            toast.success('Event deleted');
          }
        }} />
      
    </>);

}