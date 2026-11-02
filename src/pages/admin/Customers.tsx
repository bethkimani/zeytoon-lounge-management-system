import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { MailIcon, PencilIcon, PhoneIcon, PlusIcon, Trash2Icon, UserSearchIcon } from 'lucide-react';
import type { Customer } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { customerReservations, customerVisits } from '../../utils/metrics';
import { formatDate, formatTime, initials } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Segmented } from '../../components/ui/Segmented';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DemoTag } from '../../components/ui/DemoTag';
import { Drawer } from '../../components/ui/Drawer';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CustomerForm } from '../../components/admin/CustomerForm';

type TierFilter = 'All' | 'VIP' | 'Regular';

export function Customers() {
  const { customers, reservations, tables, deleteCustomer } = useData();
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState<TierFilter>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [toDelete, setToDelete] = useState<Customer | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.
    filter((c) => tier === 'All' || c.tier === tier).
    filter((c) => !q || [c.name, c.phone, c.email, c.preferences].some((f) => f.toLowerCase().includes(q))).
    map((c) => {
      const history = customerReservations(c, reservations);
      return { customer: c, visits: customerVisits(c, reservations), last: history[0] };
    }).
    sort((a, b) => b.visits - a.visits);
  }, [customers, reservations, search, tier]);

  const selected = customers.find((c) => c.id === selectedId) ?? null;
  const history = selected ? customerReservations(selected, reservations) : [];

  return (
    <>
      <PageHeader
        title="Customers"
        description="Guest profiles, preferences and booking history. Guests booking with a new phone number are added automatically."
        actions={
        <Button onClick={() => {setEditing(null);setFormOpen(true);}}>
            <PlusIcon className="h-4 w-4" /> Add customer
          </Button>
        } />
      

      <div className="rounded-2xl border border-edge bg-charcoal">
        <div className="flex flex-col gap-3 border-b border-edge p-4 sm:flex-row">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, phone, email or preference" className="flex-1" />
          <Segmented<TierFilter>
            label="Tier"
            value={tier}
            onChange={setTier}
            options={[
            { value: 'All', label: 'All', count: customers.length },
            { value: 'VIP', label: 'VIP', count: customers.filter((c) => c.tier === 'VIP').length },
            { value: 'Regular', label: 'Regular', count: customers.filter((c) => c.tier === 'Regular').length }]
            } />
          
        </div>

        {rows.length === 0 ?
        <EmptyState icon={UserSearchIcon} title="No customers found" description="Try another search or add a new customer." /> :

        <ul className="divide-y divide-edge">
            {rows.map(({ customer: c, visits, last }) =>
          <li key={c.id}>
                <button type="button" onClick={() => setSelectedId(c.id)} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-white/[0.02] md:grid-cols-[auto_1.4fr_1.4fr_100px_140px_80px]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-raised text-sm font-semibold text-gold">{initials(c.name)}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 truncate font-medium text-fg">{c.name} {c.isDemo && <DemoTag />}</span>
                    <span className="block truncate text-xs text-subtle md:hidden">{c.phone}</span>
                    <span className="hidden truncate text-xs text-subtle md:block">{c.preferences || 'No preferences recorded'}</span>
                  </span>
                  <span className="hidden min-w-0 text-sm md:block">
                    <span className="block truncate text-muted">{c.phone}</span>
                    <span className="block truncate text-xs text-subtle">{c.email || '—'}</span>
                  </span>
                  <span className="text-right text-sm md:text-left">
                    <span className="font-semibold tabular-nums text-fg">{visits}</span> <span className="text-xs text-subtle">visits</span>
                  </span>
                  <span className="hidden text-xs text-muted md:block">{last ? `Last: ${formatDate(last.date, 'd MMM yyyy')}` : 'No bookings yet'}</span>
                  <span className="hidden md:block"><StatusBadge status={c.tier} /></span>
                </button>
              </li>
          )}
          </ul>
        }
      </div>

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.name ?? ''}
        subtitle={selected ? `${selected.tier} guest · customer since ${formatDate(selected.createdAt, 'MMM yyyy')}` : ''}
        footer={
        selected &&
        <>
              <Button variant="secondary" onClick={() => {setEditing(selected);setFormOpen(true);}}>
                <PencilIcon className="h-4 w-4" /> Edit
              </Button>
              <Button variant="danger" onClick={() => setToDelete(selected)}>
                <Trash2Icon className="h-4 w-4" /> Remove
              </Button>
            </>

        }>
        
        {selected &&
        <div className="space-y-7">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-edge p-3">
                <p className="font-display text-3xl font-semibold text-gold">{customerVisits(selected, reservations)}</p>
                <p className="text-xs text-subtle">Visits</p>
              </div>
              <div className="rounded-xl border border-edge p-3">
                <p className="font-display text-3xl font-semibold">{history.length}</p>
                <p className="text-xs text-subtle">Bookings</p>
              </div>
              <div className="rounded-xl border border-edge p-3">
                <p className="font-display text-3xl font-semibold">{history.filter((r) => r.status === 'Cancelled').length}</p>
                <p className="text-xs text-subtle">Cancelled</p>
              </div>
            </div>
            <section className="space-y-2 text-sm">
              <a href={`tel:${selected.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-muted hover:text-gold"><PhoneIcon className="h-4 w-4" /> {selected.phone}</a>
              {selected.email && <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-muted hover:text-gold"><MailIcon className="h-4 w-4" /> {selected.email}</a>}
            </section>
            <section>
              <h3 className="mb-2 text-xs font-medium text-muted">Preferences</h3>
              <p className="text-sm text-fg">{selected.preferences || 'No preferences recorded yet.'}</p>
            </section>
            <section>
              <h3 className="mb-3 text-xs font-medium text-muted">Booking history</h3>
              {history.length === 0 ?
            <p className="text-sm text-subtle">No reservations on record.</p> :

            <ul className="divide-y divide-edge rounded-lg border border-edge">
                  {history.map((r) =>
              <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-3">
                      <div>
                        <p className="text-sm">{formatDate(r.date, 'EEE d MMM yyyy')} · {formatTime(r.time)}</p>
                        <p className="text-xs text-subtle">{r.guests} guests · Table {tables.find((t) => t.id === r.tableId)?.number}{r.specialRequests ? ` · ${r.specialRequests}` : ''}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </li>
              )}
                </ul>
            }
            </section>
          </div>
        }
      </Drawer>

      <CustomerForm open={formOpen} onClose={() => setFormOpen(false)} customer={editing} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Remove customer?"
        message={toDelete ? `${toDelete.name}’s profile will be removed. Their past reservations stay in the reservation log.` : ''}
        confirmLabel="Remove"
        onConfirm={() => {
          if (toDelete) {
            deleteCustomer(toDelete.id);
            setSelectedId(null);
            toast.success('Customer removed');
          }
        }} />
      
    </>);

}