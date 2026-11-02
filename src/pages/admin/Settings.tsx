import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckIcon, MinusIcon, RotateCcwIcon, Trash2Icon, UserPlusIcon } from 'lucide-react';
import type { ModuleKey, Role } from '../../types/models';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { lounge } from '../../data/lounge';
import { canManageUsers, MODULE_LABELS, ROLE_ACCESS, ROLE_DESCRIPTIONS, ROLES } from '../../utils/permissions';
import { cn } from '../../utils/cn';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { DemoTag } from '../../components/ui/DemoTag';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const modules = Object.keys(MODULE_LABELS) as ModuleKey[];

export function Settings() {
  const { user, users, addUser, updateUserRole, removeUser } = useAuth();
  const { resetDemoData } = useData();
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Staff' as Role });
  const [userError, setUserError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  if (!user) return null;
  const isAdmin = canManageUsers(user.role);

  const submitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name.trim().length < 3) return setUserError('Enter the full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) return setUserError('Enter a valid email.');
    if (newUser.password.length < 8) return setUserError('Password must be at least 8 characters.');
    const err = addUser({ ...newUser, name: newUser.name.trim(), email: newUser.email.trim() });
    if (err) return setUserError(err);
    toast.success(`${newUser.name} can now sign in as ${newUser.role}`);
    setNewUser({ name: '', email: '', password: '', role: 'Staff' });
    setUserError(null);
  };

  return (
    <>
      <PageHeader title="Settings" description="Lounge profile, user accounts and role permissions." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Your account" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs text-subtle">Name</dt><dd>{user.name}</dd></div>
            <div><dt className="text-xs text-subtle">Email</dt><dd>{user.email}</dd></div>
            <div><dt className="text-xs text-subtle">Role</dt><dd className="text-gold">{user.role}</dd><dd className="mt-0.5 text-xs text-muted">{ROLE_DESCRIPTIONS[user.role]}</dd></div>
          </dl>
        </Panel>
        <Panel title="Lounge profile" className="lg:col-span-2">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-subtle">Business name</dt><dd>{lounge.name}</dd></div>
            <div><dt className="text-xs text-subtle">Currency</dt><dd>Kenyan Shilling (KES)</dd></div>
            <div><dt className="text-xs text-subtle">Location</dt><dd>{lounge.address}</dd></div>
            <div><dt className="text-xs text-subtle">Contact</dt><dd>{lounge.phone} · {lounge.email}</dd></div>
            <div className="sm:col-span-2"><dt className="text-xs text-subtle">Opening hours</dt><dd>{lounge.hours.map((h) => `${h.days}: ${h.time}`).join(' · ')}</dd></div>
          </dl>
        </Panel>
      </div>

      <Panel title="Roles & permissions" description="Module access by role." className="mt-4" bodyClassName="overflow-x-auto p-0 pt-4">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-y border-edge text-xs text-subtle">
              <th className="px-5 py-3 text-left font-medium">Role</th>
              {modules.map((m) => <th key={m} className="px-2 py-3 text-center font-medium">{MODULE_LABELS[m].replace(' & Reports', '')}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {ROLES.map((r) =>
            <tr key={r} className={cn(r === user.role && 'bg-gold/[0.04]')}>
                <td className="px-5 py-3">
                  <p className="font-medium">{r}</p>
                  <p className="text-xs text-subtle">{ROLE_DESCRIPTIONS[r]}</p>
                </td>
                {modules.map((m) =>
              <td key={m} className="px-2 py-3 text-center">
                    {ROLE_ACCESS[r].includes(m) ?
                <CheckIcon className="mx-auto h-4 w-4 text-gold" aria-label="Allowed" /> :

                <MinusIcon className="mx-auto h-4 w-4 text-edge" aria-label="No access" />
                }
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      {isAdmin &&
      <Panel title="User accounts" description="Only administrators can add users or change roles." className="mt-4">
          <ul className="divide-y divide-edge rounded-xl border border-edge">
            {users.map((u) =>
          <li key={u.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm">{u.name} {u.isDemo && <DemoTag />} {u.id === user.id && <span className="text-xs text-gold">You</span>}</p>
                  <p className="truncate text-xs text-subtle">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                aria-label={`Role for ${u.name}`}
                className={cn(inputClass, 'h-9 w-40 py-0')}
                value={u.role}
                disabled={u.id === user.id}
                onChange={(e) => {
                  updateUserRole(u.id, e.target.value as Role);
                  toast.success(`${u.name} is now ${e.target.value}`);
                }}>
                
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <button
                type="button"
                disabled={u.id === user.id}
                onClick={() => {removeUser(u.id);toast.success(`${u.name} removed`);}}
                aria-label={`Remove ${u.name}`}
                className="rounded-lg p-2 text-muted hover:text-danger disabled:opacity-30">
                
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
              </li>
          )}
          </ul>
          <form onSubmit={submitUser} noValidate className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_160px_auto] lg:items-end">
            <Field label="Full name" htmlFor="nu-name"><input id="nu-name" className={inputClass} value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} /></Field>
            <Field label="Email" htmlFor="nu-email"><input id="nu-email" type="email" className={inputClass} value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} /></Field>
            <Field label="Temporary password" htmlFor="nu-pass"><input id="nu-pass" type="password" className={inputClass} value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} /></Field>
            <Field label="Role" htmlFor="nu-role">
              <select id="nu-role" className={inputClass} value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Button type="submit" className="h-[42px]"><UserPlusIcon className="h-4 w-4" /> Add user</Button>
          </form>
          {userError && <p role="alert" className="mt-2 text-xs text-danger">{userError}</p>}
        </Panel>
      }

      {(user.role === 'Administrator' || user.role === 'Manager') &&
      <Panel title="Demonstration data" className="mt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm text-muted">
              Every record in this prototype is fictional and stored only in this browser. Nothing is connected to real customers,
              payments or bookings. Sample data refreshes daily so the dashboard stays current.
            </p>
            <Button variant="secondary" onClick={() => setConfirmReset(true)}><RotateCcwIcon className="h-4 w-4" /> Restore sample data</Button>
          </div>
        </Panel>
      }

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Restore sample data?"
        message="All changes made in this browser — new reservations, sales, stock updates and events — will be replaced with the original demonstration data."
        confirmLabel="Restore"
        onConfirm={resetDemoData} />
      
    </>);

}