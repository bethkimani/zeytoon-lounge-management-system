import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CalendarPlusIcon, UserCheckIcon, UserXIcon } from 'lucide-react';
import type { LoungeTable, TableStatus } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { formatTime, todayISO } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { StatusBadge } from '../ui/StatusBadge';

interface TableDetailPanelProps {
  table: LoungeTable | null;
  onClose: () => void;
  onNewBooking: (tableId: string) => void;
}

const statuses: {value: TableStatus;style: string;}[] = [
{ value: 'Available', style: 'border-ok/40 bg-ok/10 text-ok' },
{ value: 'Reserved', style: 'border-warn/40 bg-warn/10 text-warn' },
{ value: 'Occupied', style: 'border-danger/40 bg-danger/10 text-danger' }];


export function TableDetailPanel({ table, onClose, onNewBooking }: TableDetailPanelProps) {
  const { updateTable, reservations, customers, setReservationStatus } = useData();
  const [guest, setGuest] = useState('');

  useEffect(() => {
    setGuest(table?.assignedCustomer ?? '');
  }, [table]);

  if (!table) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;

  const todays = reservations.
  filter((r) => r.tableId === table.id && r.date === todayISO() && r.status !== 'Cancelled').
  sort((a, b) => a.time.localeCompare(b.time));

  const setStatus = (status: TableStatus) => {
    updateTable(table.id, { status, assignedCustomer: status === 'Available' ? '' : table.assignedCustomer });
    toast.success(`Table ${table.number} is now ${status}`);
  };

  const assign = () => {
    if (guest.trim().length < 2) {
      toast.error('Enter the guest’s name to assign this table.');
      return;
    }
    updateTable(table.id, { assignedCustomer: guest.trim(), status: table.status === 'Available' ? 'Occupied' : table.status });
    toast.success(`${guest.trim()} assigned to Table ${table.number}`);
  };

  return (
    <Drawer
      open={!!table}
      onClose={onClose}
      title={`Table ${table.number}`}
      subtitle={`${table.zone} · seats ${table.capacity}`}
      footer={
      <Button variant="secondary" className="w-full" onClick={() => onNewBooking(table.id)}>
          <CalendarPlusIcon className="h-4 w-4" /> New booking for this table
        </Button>
      }>
      
      <div className="space-y-7">
        <section>
          <h3 className="mb-3 text-xs font-medium text-muted">Status</h3>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Table status">
            {statuses.map((s) =>
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={table.status === s.value}
              onClick={() => setStatus(s.value)}
              className={cn(
                'h-10 rounded-lg border text-sm font-medium transition-colors duration-150',
                table.status === s.value ? s.style : 'border-edge text-muted hover:border-gold/30 hover:text-fg'
              )}>
              
                {s.value}
              </button>
            )}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-medium text-muted">Assigned guest</h3>
          {table.assignedCustomer ?
          <div className="mb-3 flex items-center justify-between rounded-lg border border-gold/25 bg-gold/5 px-3 py-2.5">
              <span className="text-sm text-fg">{table.assignedCustomer}</span>
              <button
              type="button"
              onClick={() => {
                updateTable(table.id, { assignedCustomer: '', status: 'Available' });
                toast.success(`Table ${table.number} cleared`);
              }}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-danger">
              
                <UserXIcon className="h-3.5 w-3.5" /> Clear table
              </button>
            </div> :

          <p className="mb-3 text-sm text-subtle">No guest seated.</p>
          }
          <div className="flex gap-2">
            <Field label="Guest name" htmlFor="assign-guest" className="flex-1">
              <input id="assign-guest" list="customer-names" className={inputClass} value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="Search customers or type a name" />
              <datalist id="customer-names">
                {customers.map((c) => <option key={c.id} value={c.name} />)}
              </datalist>
            </Field>
            <Button className="mt-[22px]" onClick={assign}>
              <UserCheckIcon className="h-4 w-4" /> Assign
            </Button>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-medium text-muted">Today’s bookings</h3>
          {todays.length === 0 ?
          <p className="text-sm text-subtle">No bookings for this table today.</p> :

          <ul className="divide-y divide-edge rounded-lg border border-edge">
              {todays.map((r) =>
            <li key={r.id} className="flex items-center gap-3 px-3 py-3">
                  <span className="w-16 shrink-0 text-sm tabular-nums text-gold">{formatTime(r.time)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{r.customerName}</p>
                    <p className="text-xs text-subtle">{r.guests} guests</p>
                  </div>
                  {r.status === 'Completed' ?
              <StatusBadge status="Completed" /> :

              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  updateTable(table.id, { status: 'Occupied', assignedCustomer: r.customerName });
                  if (r.status === 'Pending') setReservationStatus(r.id, 'Confirmed');
                  toast.success(`${r.customerName} seated at Table ${table.number}`);
                }}>
                
                      Seat
                    </Button>
              }
                </li>
            )}
            </ul>
          }
        </section>
      </div>
    </Drawer>);

}