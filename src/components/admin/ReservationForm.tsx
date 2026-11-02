import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircleIcon } from 'lucide-react';
import type { Reservation, ReservationInput, ReservationSource, ReservationStatus } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { findConflict, validateReservation } from '../../utils/reservations';
import type { ReservationErrors } from '../../utils/reservations';
import { todayISO } from '../../utils/format';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

interface ReservationFormProps {
  open: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
  defaultDate?: string;
  defaultTableId?: string;
}

const statuses: ReservationStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const sources: ReservationSource[] = ['Phone', 'Walk-in', 'WhatsApp', 'Website'];

function emptyInput(date?: string, tableId?: string): ReservationInput {
  return {
    customerName: '',
    phone: '',
    email: '',
    date: date ?? todayISO(),
    time: '19:00',
    guests: 2,
    tableId: tableId ?? '',
    specialRequests: '',
    status: 'Pending',
    source: 'Phone'
  };
}

export function ReservationForm({ open, onClose, reservation, defaultDate, defaultTableId }: ReservationFormProps) {
  const { tables, reservations, customers, addReservation, updateReservation } = useData();
  const [form, setForm] = useState<ReservationInput>(emptyInput());
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setFormError(null);
    if (reservation) {
      const { id: _id, customerId: _c, createdAt: _cr, isDemo: _d, ...rest } = reservation;
      setForm(rest);
    } else {
      setForm(emptyInput(defaultDate, defaultTableId));
    }
  }, [open, reservation, defaultDate, defaultTableId]);

  const set = <K extends keyof ReservationInput,>(key: K, value: ReservationInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setFormError(null);
  };

  const tableOptions = useMemo(
    () =>
    [...tables].
    sort((a, b) => a.number - b.number).
    map((t) => {
      const conflict = form.time ? findConflict(reservations, { ...form, tableId: t.id }, reservation?.id) : undefined;
      const tooSmall = form.guests > t.capacity;
      return { table: t, conflict, tooSmall };
    }),
    [tables, reservations, form, reservation?.id]
  );

  const fillCustomer = (id: string) => {
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    setForm((f) => ({ ...f, customerName: c.name, phone: c.phone, email: c.email }));
    setErrors({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateReservation(form, tables);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setSaving(true);
    const result = reservation ? updateReservation(reservation.id, form) : addReservation(form);
    setSaving(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    toast.success(reservation ? 'Reservation updated' : `Reservation created for ${form.customerName}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={reservation ? 'Edit reservation' : 'New reservation'}
      description="Tables are held for 2 hours per booking to prevent double-booking."
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="reservation-form" loading={saving}>
            {reservation ? 'Save changes' : 'Create reservation'}
          </Button>
        </>
      }>
      
      <form id="reservation-form" onSubmit={submit} noValidate className="space-y-5">
        {formError &&
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" /> {formError}
          </div>
        }

        {!reservation &&
        <Field label="Returning guest (optional)" htmlFor="res-existing" hint="Fills in contact details from the customer database.">
            <select id="res-existing" className={inputClass} defaultValue="" onChange={(e) => fillCustomer(e.target.value)}>
              <option value="">New guest</option>
              {customers.map((c) =>
            <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
            )}
            </select>
          </Field>
        }

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="res-name" required error={errors.customerName} className="sm:col-span-2">
            <input id="res-name" className={inputClass} value={form.customerName} onChange={(e) => set('customerName', e.target.value)} placeholder="e.g. Wanjiru Kamau" />
          </Field>
          <Field label="Phone number" htmlFor="res-phone" required error={errors.phone}>
            <input id="res-phone" type="tel" className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="0712 345 678" />
          </Field>
          <Field label="Email address" htmlFor="res-email" error={errors.email}>
            <input id="res-email" type="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="guest@example.com" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date" htmlFor="res-date" required error={errors.date}>
            <input id="res-date" type="date" className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
          <Field label="Time" htmlFor="res-time" required error={errors.time}>
            <input id="res-time" type="time" step={900} className={inputClass} value={form.time} onChange={(e) => set('time', e.target.value)} />
          </Field>
          <Field label="Guests" htmlFor="res-guests" required error={errors.guests}>
            <input id="res-guests" type="number" min={1} max={40} className={inputClass} value={form.guests || ''} onChange={(e) => set('guests', Number(e.target.value))} />
          </Field>
        </div>

        <Field label="Preferred table" htmlFor="res-table" required error={errors.tableId} hint="Booked or too-small tables are disabled for the selected date and time.">
          <select id="res-table" className={inputClass} value={form.tableId} onChange={(e) => set('tableId', e.target.value)}>
            <option value="">Select a table</option>
            {tableOptions.map(({ table, conflict, tooSmall }) =>
            <option key={table.id} value={table.id} disabled={!!conflict && form.status !== 'Cancelled' || tooSmall}>
                Table {table.number} · {table.zone} · seats {table.capacity}
                {conflict ? ` — booked (${conflict.customerName})` : tooSmall ? ' — too small' : ''}
              </option>
            )}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Booking status" htmlFor="res-status">
            <select id="res-status" className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value as ReservationStatus)}>
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Booking source" htmlFor="res-source">
            <select id="res-source" className={inputClass} value={form.source} onChange={(e) => set('source', e.target.value as ReservationSource)}>
              {sources.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Special requests" htmlFor="res-notes">
          <textarea id="res-notes" rows={3} className={inputClass} value={form.specialRequests} onChange={(e) => set('specialRequests', e.target.value)} placeholder="Allergies, celebrations, seating preferences…" />
        </Field>
      </form>
    </Modal>);

}