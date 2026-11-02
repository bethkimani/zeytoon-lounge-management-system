import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ShiftType, StaffInput, StaffMember, StaffStatus } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { shiftTimes, staffPositions, weekdays } from '../../data/staff';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  member?: StaffMember | null;
}

type Errors = Partial<Record<'name' | 'phone' | 'email', string>>;

const empty = (): StaffInput => ({
  name: '',
  position: staffPositions[0],
  phone: '',
  email: '',
  status: 'Active',
  responsibilities: [],
  shifts: { Mon: 'Off', Tue: 'Off', Wed: 'Off', Thu: 'Off', Fri: 'Off', Sat: 'Off', Sun: 'Off' }
});

const shiftOptions: ShiftType[] = ['Morning', 'Evening', 'Night', 'Off'];

export function StaffForm({ open, onClose, member }: StaffFormProps) {
  const { addStaff, updateStaff } = useData();
  const [form, setForm] = useState<StaffInput>(empty());
  const [resp, setResp] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (member) {
      const { id: _id, isDemo: _d, ...rest } = member;
      setForm(rest);
      setResp(rest.responsibilities.join(', '));
    } else {
      setForm(empty());
      setResp('');
    }
  }, [open, member]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Errors = {};
    if (form.name.trim().length < 3) v.name = 'Enter the full name.';
    if (!/^(\+?254|0)[17]\d{8}$/.test(form.phone.replace(/\s/g, ''))) v.phone = 'Use a Kenyan number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) v.email = 'Enter a valid email.';
    if (Object.keys(v).length) return setErrors(v);
    const input = { ...form, responsibilities: resp.split(',').map((r) => r.trim()).filter(Boolean) };
    if (member) updateStaff(member.id, input);else
    addStaff(input);
    toast.success(member ? 'Staff record updated' : `${form.name} added`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={member ? 'Edit staff member' : 'Add staff member'}
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="staff-form">{member ? 'Save changes' : 'Add staff member'}</Button>
        </>
      }>
      
      <form id="staff-form" onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="sf-name" required error={errors.name}>
            <input id="sf-name" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Position" htmlFor="sf-pos">
            <select id="sf-pos" className={inputClass} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
              {staffPositions.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Phone" htmlFor="sf-phone" required error={errors.phone}>
            <input id="sf-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Email" htmlFor="sf-email" required error={errors.email}>
            <input id="sf-email" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Employment status" htmlFor="sf-status">
            <select id="sf-status" className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as StaffStatus })}>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </Field>
          <Field label="Responsibilities" htmlFor="sf-resp" hint="Separate with commas.">
            <input id="sf-resp" className={inputClass} value={resp} onChange={(e) => setResp(e.target.value)} placeholder="Bar, Stock, VIP section" />
          </Field>
        </div>
        <fieldset>
          <legend className="mb-2 text-xs font-medium text-muted">Weekly shift schedule</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {weekdays.map((d) =>
            <label key={d} className="flex flex-col gap-1 text-xs text-subtle">
                {d}
                <select
                className={`${inputClass} px-2 py-2 text-xs`}
                value={form.shifts[d]}
                onChange={(e) => setForm({ ...form, shifts: { ...form.shifts, [d]: e.target.value as ShiftType } })}>
                
                  {shiftOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}
          </div>
          <p className="mt-2 text-xs text-subtle">Morning {shiftTimes.Morning} · Evening {shiftTimes.Evening} · Night {shiftTimes.Night}</p>
        </fieldset>
      </form>
    </Modal>);

}