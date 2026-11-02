import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { MailIcon, PencilIcon, PhoneIcon, PlusIcon, Trash2Icon, UserSearchIcon } from 'lucide-react';
import type { ShiftType, StaffMember } from '../../types/models';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { shiftTimes, weekdays } from '../../data/staff';
import { canEditStaff } from '../../utils/permissions';
import { initials } from '../../utils/format';
import { cn } from '../../utils/cn';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Segmented } from '../../components/ui/Segmented';
import { SearchInput } from '../../components/ui/SearchInput';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DemoTag } from '../../components/ui/DemoTag';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StaffForm } from '../../components/admin/StaffForm';

type Tab = 'directory' | 'schedule';

const shiftStyle: Record<ShiftType, string> = {
  Morning: 'bg-info/10 text-info',
  Evening: 'bg-gold/10 text-gold',
  Night: 'bg-[#9B7FD4]/10 text-[#B9A3E8]',
  Off: 'text-subtle'
};

export function Staff() {
  const { user } = useAuth();
  const { staff, deleteStaff } = useData();
  const [tab, setTab] = useState<Tab>('directory');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [toDelete, setToDelete] = useState<StaffMember | null>(null);
  const editable = !!user && canEditStaff(user.role);
  const todayKey = weekdays[(new Date().getDay() + 6) % 7];

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((s) => !q || [s.name, s.position, ...s.responsibilities].some((f) => f.toLowerCase().includes(q)));
  }, [staff, search]);

  const onShiftToday = staff.filter((s) => s.status === 'Active' && s.shifts[todayKey] !== 'Off').length;

  return (
    <>
      <PageHeader
        title="Staff"
        description={`${staff.length} team members · ${onShiftToday} on shift today (${todayKey})`}
        actions={
        <>
            <Segmented<Tab>
            label="Staff view"
            value={tab}
            onChange={setTab}
            options={[
            { value: 'directory', label: 'Directory' },
            { value: 'schedule', label: 'Shift schedule' }]
            } />
          
            {editable &&
          <Button onClick={() => {setEditing(null);setFormOpen(true);}}>
                <PlusIcon className="h-4 w-4" /> Add staff
              </Button>
          }
          </>
        } />
      

      <SearchInput value={search} onChange={setSearch} placeholder="Search name, position or responsibility" className="mb-4 max-w-md" />

      {list.length === 0 ?
      <div className="rounded-2xl border border-edge bg-charcoal"><EmptyState icon={UserSearchIcon} title="No staff found" /></div> :
      tab === 'directory' ?
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((s) =>
        <article key={s.id} className="flex flex-col rounded-2xl border border-edge bg-charcoal p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-raised font-semibold text-gold">{initials(s.name)}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="flex items-center gap-2 truncate font-medium">{s.name} {s.isDemo && <DemoTag />}</h2>
                  <p className="text-sm text-muted">{s.position}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.responsibilities.map((r) =>
            <span key={r} className="rounded-md border border-edge px-2 py-0.5 text-xs text-muted">{r}</span>
            )}
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-muted hover:text-gold"><PhoneIcon className="h-3.5 w-3.5" /> {s.phone}</a>
                <a href={`mailto:${s.email}`} className="flex items-center gap-2 truncate text-muted hover:text-gold"><MailIcon className="h-3.5 w-3.5" /> {s.email}</a>
              </div>
              <div className="mt-auto pt-4">
              <div className="flex min-h-[44px] items-center justify-between border-t border-edge pt-3">
                <p className="text-xs text-subtle">
                  Today: <span className={s.shifts[todayKey] === 'Off' ? 'text-subtle' : 'text-fg'}>{s.shifts[todayKey]}{s.shifts[todayKey] !== 'Off' ? ` · ${shiftTimes[s.shifts[todayKey]]}` : ''}</span>
                </p>
                {editable &&
              <div className="flex gap-1">
                    <button type="button" onClick={() => {setEditing(s);setFormOpen(true);}} aria-label={`Edit ${s.name}`} className="rounded-lg p-1.5 text-muted hover:text-gold"><PencilIcon className="h-4 w-4" /></button>
                    <button type="button" onClick={() => setToDelete(s)} aria-label={`Remove ${s.name}`} className="rounded-lg p-1.5 text-muted hover:text-danger"><Trash2Icon className="h-4 w-4" /></button>
                  </div>
              }
              </div>
              </div>
            </article>
        )}
        </div> :

      <div className="overflow-x-auto rounded-2xl border border-edge bg-charcoal">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-edge text-xs text-subtle">
                <th className="px-4 py-3 text-left font-medium">Team member</th>
                {weekdays.map((d) =>
              <th key={d} className={cn('px-2 py-3 text-center font-medium', d === todayKey && 'text-gold')}>{d}</th>
              )}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {list.map((s) =>
            <tr key={s.id}>
                  <td className="px-4 py-3">
                    <p className="text-fg">{s.name}</p>
                    <p className="text-xs text-subtle">{s.position}</p>
                  </td>
                  {weekdays.map((d) =>
              <td key={d} className={cn('px-1.5 py-2 text-center', d === todayKey && 'bg-gold/[0.04]')}>
                      <span className={cn('inline-block w-full rounded-md px-1 py-1.5 text-xs', shiftStyle[s.shifts[d]])} title={shiftTimes[s.shifts[d]]}>
                        {s.shifts[d]}
                      </span>
                    </td>
              )}
                </tr>
            )}
            </tbody>
          </table>
          <p className="border-t border-edge px-4 py-3 text-xs text-subtle">
            Morning {shiftTimes.Morning} · Evening {shiftTimes.Evening} · Night {shiftTimes.Night}
          </p>
        </div>
      }

      <StaffForm open={formOpen} onClose={() => setFormOpen(false)} member={editing} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Remove staff member?"
        message={toDelete ? `${toDelete.name} will be removed from the directory and shift schedule.` : ''}
        confirmLabel="Remove"
        onConfirm={() => {
          if (toDelete) {
            deleteStaff(toDelete.id);
            toast.success('Staff member removed');
          }
        }} />
      
    </>);

}