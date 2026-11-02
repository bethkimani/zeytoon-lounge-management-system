import React, { useState } from 'react';
import { UsersIcon } from 'lucide-react';
import type { TableStatus } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { tableZones } from '../../data/tables';
import { formatTime, todayISO } from '../../utils/format';
import { cn } from '../../utils/cn';
import { PageHeader } from '../../components/ui/PageHeader';
import { Segmented } from '../../components/ui/Segmented';
import { TableDetailPanel } from '../../components/admin/TableDetailPanel';
import { ReservationForm } from '../../components/admin/ReservationForm';

type Filter = 'All' | TableStatus;

const statusStyle: Record<TableStatus, {ring: string;dot: string;text: string;}> = {
  Available: { ring: 'border-ok/30 hover:border-ok/60', dot: 'bg-ok', text: 'text-ok' },
  Reserved: { ring: 'border-warn/35 hover:border-warn/70', dot: 'bg-warn', text: 'text-warn' },
  Occupied: { ring: 'border-danger/35 hover:border-danger/70', dot: 'bg-danger', text: 'text-danger' }
};

export function Tables() {
  const { tables, reservations } = useData();
  const [filter, setFilter] = useState<Filter>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bookingTable, setBookingTable] = useState<string | null>(null);

  const selected = tables.find((t) => t.id === selectedId) ?? null;
  const count = (s: TableStatus) => tables.filter((t) => t.status === s).length;
  const seatsFree = tables.filter((t) => t.status === 'Available').reduce((s, t) => s + t.capacity, 0);
  const today = todayISO();

  const nextBooking = (tableId: string) =>
  reservations.
  filter((r) => r.tableId === tableId && r.date === today && (r.status === 'Confirmed' || r.status === 'Pending')).
  sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <>
      <PageHeader
        title="Tables"
        description={`${count('Available')} tables free right now · ${seatsFree} seats available. Select a table to update status or seat a guest.`}
        actions={
        <Segmented<Filter>
          label="Filter tables"
          value={filter}
          onChange={setFilter}
          options={[
          { value: 'All', label: 'All', count: tables.length },
          { value: 'Available', label: 'Available', count: count('Available') },
          { value: 'Reserved', label: 'Reserved', count: count('Reserved') },
          { value: 'Occupied', label: 'Occupied', count: count('Occupied') }]
          } />

        } />
      

      <div className="space-y-8">
        {tableZones.map((zone) => {
          const zoneTables = tables.
          filter((t) => t.zone === zone && (filter === 'All' || t.status === filter)).
          sort((a, b) => a.number - b.number);
          if (zoneTables.length === 0) return null;
          return (
            <section key={zone} aria-labelledby={`zone-${zone}`}>
              <div className="mb-3 flex items-baseline gap-3">
                <h2 id={`zone-${zone}`} className="font-display text-2xl font-semibold">{zone}</h2>
                <span className="text-xs text-subtle">{zoneTables.length} tables</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {zoneTables.map((t) => {
                  const style = statusStyle[t.status];
                  const next = nextBooking(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={cn(
                        'flex min-h-[150px] flex-col rounded-2xl border bg-charcoal p-4 text-left transition-[border-color,transform] duration-150 ease-out active:scale-[0.98]',
                        style.ring
                      )}
                      aria-label={`Table ${t.number}, ${t.status}, seats ${t.capacity}`}>
                      
                      <div className="flex items-start justify-between">
                        <span className="font-display text-4xl font-semibold leading-none">{t.number}</span>
                        <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', style.text)}>
                          <span className={cn('h-2 w-2 rounded-full', style.dot)} /> {t.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1" aria-hidden="true">
                        {Array.from({ length: t.capacity }).map((_, i) =>
                        <span key={i} className={cn('h-1.5 w-1.5 rounded-full', t.status === 'Occupied' ? 'bg-danger/70' : 'bg-edge')} />
                        )}
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-subtle">
                        <UsersIcon className="h-3 w-3" /> Seats {t.capacity}
                      </p>
                      <div className="mt-auto pt-3 text-xs">
                        {t.assignedCustomer ?
                        <p className="truncate text-fg">{t.assignedCustomer}</p> :
                        next ?
                        <p className="truncate text-muted">Next: <span className="text-gold">{formatTime(next.time)}</span> {next.customerName.split(' ')[0]}</p> :

                        <p className="text-subtle">Open all day</p>
                        }
                      </div>
                    </button>);

                })}
              </div>
            </section>);

        })}
      </div>

      <TableDetailPanel
        table={selected}
        onClose={() => setSelectedId(null)}
        onNewBooking={(id) => {
          setSelectedId(null);
          setBookingTable(id);
        }} />
      
      <ReservationForm open={!!bookingTable} onClose={() => setBookingTable(null)} defaultTableId={bookingTable ?? undefined} />
    </>);

}