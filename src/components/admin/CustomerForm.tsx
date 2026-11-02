import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Customer, CustomerInput, CustomerTier } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

type Errors = Partial<Record<keyof CustomerInput, string>>;

const empty: CustomerInput = { name: '', phone: '', email: '', preferences: '', previousVisits: 0, tier: 'Regular' };

export function CustomerForm({ open, onClose, customer }: CustomerFormProps) {
  const { addCustomer, updateCustomer } = useData();
  const [form, setForm] = useState<CustomerInput>(empty);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(customer ? { name: customer.name, phone: customer.phone, email: customer.email, preferences: customer.preferences, previousVisits: customer.previousVisits, tier: customer.tier } : empty);
  }, [open, customer]);

  const set = <K extends keyof CustomerInput,>(k: K, v: CustomerInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Errors = {};
    if (form.name.trim().length < 3) v.name = 'Enter the full name.';
    if (!/^(\+?254|0)[17]\d{8}$/.test(form.phone.replace(/\s/g, ''))) v.phone = 'Use a Kenyan number, e.g. 0712 345 678.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) v.email = 'Enter a valid email.';
    if (Object.keys(v).length) return setErrors(v);
    const result = customer ? updateCustomer(customer.id, form) : addCustomer(form);
    if (!result.ok) return setErrors({ phone: result.error });
    toast.success(customer ? 'Customer updated' : `${form.name} added`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={customer ? 'Edit customer' : 'Add customer'}
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="customer-form">{customer ? 'Save changes' : 'Add customer'}</Button>
        </>
      }>
      
      <form id="customer-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="cu-name" required error={errors.name} className="sm:col-span-2">
          <input id="cu-name" className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Phone number" htmlFor="cu-phone" required error={errors.phone}>
          <input id="cu-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="0712 345 678" />
        </Field>
        <Field label="Email" htmlFor="cu-email" error={errors.email}>
          <input id="cu-email" type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Guest tier" htmlFor="cu-tier">
          <select id="cu-tier" className={inputClass} value={form.tier} onChange={(e) => set('tier', e.target.value as CustomerTier)}>
            <option>Regular</option>
            <option>VIP</option>
          </select>
        </Field>
        <Field label="Visits before this system" htmlFor="cu-visits" hint="Historic visits not recorded here.">
          <input id="cu-visits" type="number" min={0} className={inputClass} value={form.previousVisits} onChange={(e) => set('previousVisits', Math.max(0, Number(e.target.value)))} />
        </Field>
        <Field label="Preferences" htmlFor="cu-pref" className="sm:col-span-2">
          <textarea id="cu-pref" rows={3} className={inputClass} value={form.preferences} onChange={(e) => set('preferences', e.target.value)} placeholder="Favourite drinks, seating, allergies, occasions…" />
        </Field>
      </form>
    </Modal>);

}