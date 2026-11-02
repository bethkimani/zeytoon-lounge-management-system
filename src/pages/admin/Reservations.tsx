import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CalendarSearchIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { formatDate, formatTime, todayISO } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Segmented } from '../../components/ui/Segmented';
import { EmptyState } from '../../components/ui/EmptyState';
import { DemoTag } from '../../components/ui/DemoTag';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { inputClass } from '../../components/ui/Field';
import { statusTone } from '../../components/ui/StatusBadge';
import { ReservationForm } from '../../components/admin/ReservationForm';
import { ReservationCalendar } from '../../components/admin/ReservationCalendar';
import { cn } from '../../utils/cn';

type StatusFilter = 'All' | ReservationStatus;
type DateFilter = 'upcoming' | 'today' | 'past' | 'all';
type View = 'list' | 'calendar';

const statusOptions: ReservationStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const toneText: Record<string, string> = {
  ok: 'text-ok border-ok/30',
  warn: 'text-warn border-warn/30',
  danger: 'text-danger border-danger/30',
  info: 'text-info border-info/30',
  gold: 'text-gold border-gold/30',
  muted: 'text-muted border-edge'
};

export function Reservations() {
  const { reservations, tables, setReservationStatus, deleteReservation } = useData();
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('upcoming');
  const [tableFilter, setTableFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();
  const [toDelete, setToDelete] = useState<Reservation | null>(null);

  const tableNumber = (id: string) => tables.find((t) => t.id === id)?.number ?? '—';
  const today = todayISO();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations.
    filter((r) => status === 'All' ? true : r.status === status).
    filter((r) => tableFilter ? r.tableId === tableFilter : true).
    filter((r) => {
      if (dateFilter === 'today') return r.date === today;
      if (dateFilter === 'upcoming') return r.date >= today;
      if (dateFilter === 'past') return r.date < today;
      return true;
    }).
    filter((r) => !q || [r.customerName, r.phone, r.email, r.specialRequests].some((f) => f.toLowerCase().includes(q))).
    sort((a, b) =>
    dateFilter === 'past' ?
    b.date.localeCompare(a.date) || b.time.localeCompare(a.time) :
    a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    );
  }, [reservations, status, tableFilter, dateFilter, search, today]);

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = { All: reservations.length, Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 };
    reservations.forEach((r) => base[r.status] += 1);
    return base;
  }, [reservations]);

  const openCreate = (date?: string) => {
    setEditing(null);
    setDefaultDate(date);
    setFormOpen(true);
  };

  const openEdit = (r: Reservation) => {
    setEditing(r);
    setFormOpen(true);
  };

  const changeStatus = (r: Reservation, next: ReservationStatus) => {
    const result = setReservationStatus(r.id, next);
    if (result.ok) toast.success(`${r.customerName} → ${next}`);else
    toast.error(result.error);
  };

  const StatusSelect = ({ r }: {r: Reservation;}) =>
  <select
    aria-label={`Status for ${r.customerName}`}
    value={r.status}
    onChange={(e) => changeStatus(r, e.target.value as ReservationStatus)}
    className={cn('h-8 rounded-full border bg-night px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold/20', toneText[statusTone(r.status)])}>
    
      {statusOptions.map((s) => <option key={s}>{s}</option>)}
    </select>;


  return (
    <>
      <PageHeader
        title="Reservations"
        description="Create, confirm and track bookings. Double-booking a table within a 2-hour window is blocked automatically."
        actions={
        <>
            <Segmented<View>
            label="View"
            value={view}
            onChange={setView}
            options={[
            { value: 'list', label: 'Table view' },
            { value: 'calendar', label: 'Calendar' }]
            } />
          
            <Button onClick={() => openCreate()}>
              <PlusIcon className="h-4 w-4" /> New reservation
            </Button>
          </>
        } />
      

      {view === 'calendar' ?
      <ReservationCalendar reservations={reservations} tables={tables} onSelect={openEdit} onCreate={openCreate} /> :

      <div className="rounded-2xl border border-edge bg-charcoal">
          <div className="flex flex-col gap-3 border-b border-edge p-4">
            <Segmented<StatusFilter>
            label="Filter by status"
            value={status}
            onChange={setStatus}
            options={(['All', ...statusOptions] as StatusFilter[]).map((s) => ({ value: s, label: s, count: counts[s] }))} />
          
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <SearchInput value={search} onChange={setSearch} placeholder="Search name, phone, email or notes" />
              <select aria-label="Date range" className={cn(inputClass, 'h-10 py-0 sm:w-40')} value={dateFilter} onChange={(e) => setDateFilter(e.target.value as DateFilter)}>
                <option value="upcoming">Upcoming</option>
                <option value="today">Today</option>
                <option value="past">Past</option>
                <option value="all">All dates</option>
              </select>
              <select aria-label="Table" className={cn(inputClass, 'h-10 py-0 sm:w-36')} value={tableFilter} onChange={(e) => setTableFilter(e.target.value)}>
                <option value="">All tables</option>
                {tables.map((t) => <option key={t.id} value={t.id}>Table {t.number}</option>)}
              </select>
            </div>
          </div>

          {filtered.length === 0 ?
        <EmptyState
          icon={CalendarSearchIcon}
          title="No reservations match"
          description="Try a different status, date range or search term."
          action={<Button variant="secondary" onClick={() => {setSearch('');setStatus('All');setDateFilter('all');setTableFilter('');}}>Clear filters</Button>} /> :


        <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-edge text-left text-xs text-subtle">
                      <th className="px-4 py-3 font-medium">Guest</th>
                      <th className="px-4 py-3 font-medium">Date & time</th>
                      <th className="px-4 py-3 font-medium">Guests</th>
                      <th className="px-4 py-3 font-medium">Table</th>
                      <th className="px-4 py-3 font-medium">Requests</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-edge">
                    {filtered.map((r) =>
                <tr key={r.id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-fg">{r.customerName}</span>
                            {r.isDemo && <DemoTag />}
                          </div>
                          <p className="text-xs text-subtle">{r.phone} · {r.source}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <p className="text-fg">{formatDate(r.date, 'EEE d MMM')}</p>
                          <p className="text-xs text-gold">{formatTime(r.time)}</p>
                        </td>
                        <td className="px-4 py-3 tabular-nums">{r.guests}</td>
                        <td className="px-4 py-3">T{tableNumber(r.tableId)}</td>
                        <td className="max-w-[220px] px-4 py-3"><p className="truncate text-xs text-muted">{r.specialRequests || '—'}</p></td>
                        <td className="px-4 py-3"><StatusSelect r={r} /></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => openEdit(r)} aria-label={`Edit ${r.customerName}`} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-gold"><PencilIcon className="h-4 w-4" /></button>
                            <button type="button" onClick={() => setToDelete(r)} aria-label={`Delete ${r.customerName}`} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-danger"><Trash2Icon className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-edge md:hidden">
                {filtered.map((r) =>
            <li key={r.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-medium">{r.customerName} {r.isDemo && <DemoTag />}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatDate(r.date, 'EEE d MMM')} · <span className="text-gold">{formatTime(r.time)}</span> · {r.guests} guests · T{tableNumber(r.tableId)}
                        </p>
                      </div>
                      <div className="flex shrink-0">
                        <button type="button" onClick={() => openEdit(r)} aria-label="Edit" className="rounded-lg p-2 text-muted hover:text-gold"><PencilIcon className="h-4 w-4" /></button>
                        <button type="button" onClick={() => setToDelete(r)} aria-label="Delete" className="rounded-lg p-2 text-muted hover:text-danger"><Trash2Icon className="h-4 w-4" /></button>
                      </div>
                    </div>
                    {r.specialRequests && <p className="mt-2 text-xs text-subtle">{r.specialRequests}</p>}
                    <div className="mt-3"><StatusSelect r={r} /></div>
                  </li>
            )}
              </ul>
              <p className="border-t border-edge px-4 py-3 text-xs text-subtle">
                Showing {filtered.length} of {reservations.length} reservations
              </p>
            </>
        }
        </div>
      }

      <ReservationForm open={formOpen} onClose={() => setFormOpen(false)} reservation={editing} defaultDate={defaultDate} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete reservation?"
        message={toDelete ? `This permanently removes ${toDelete.customerName}’s booking on ${formatDate(toDelete.date)}. To keep a record, mark it Cancelled instead.` : ''}
        onConfirm={() => {
          if (toDelete) {
            deleteReservation(toDelete.id);
            toast.success('Reservation deleted');
          }
        }} />
      
    </>);

}