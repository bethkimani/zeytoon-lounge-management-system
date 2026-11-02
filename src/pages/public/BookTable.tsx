import React, { useState } from 'react';
import { AlertCircleIcon, CheckCircle2Icon, MessageCircleIcon } from 'lucide-react';
import type { TableZone } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { images } from '../../data/images';
import { tableZones } from '../../data/tables';
import { whatsappLink } from '../../data/lounge';
import { daysFromToday, formatDate, formatTime, todayISO } from '../../utils/format';
import { findConflict, validateReservation } from '../../utils/reservations';
import type { ReservationErrors } from '../../utils/reservations';
import { PageHero } from '../../components/public/PageHero';
import { Field, inputClass } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  zone: TableZone | 'Any';
  requests: string;
}

const initial: BookingForm = { name: '', phone: '', email: '', date: daysFromToday(1), time: '19:30', guests: 2, zone: 'Any', requests: '' };

export function BookTable() {
  const { tables, reservations, addReservation } = useData();
  const [form, setForm] = useState<BookingForm>(initial);
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<BookingForm | null>(null);

  const set = <K extends keyof BookingForm,>(k: K, v: BookingForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setFormError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const base = {
      customerName: form.name,
      phone: form.phone,
      email: form.email,
      date: form.date,
      time: form.time,
      guests: form.guests,
      specialRequests: form.requests,
      status: 'Pending' as const,
      source: 'Website' as const
    };
    const candidates = tables.
    filter((t) => (form.zone === 'Any' || t.zone === form.zone) && t.capacity >= form.guests).
    sort((a, b) => a.capacity - b.capacity).
    filter((t) => !findConflict(reservations, { ...base, tableId: t.id }));
    const v = validateReservation({ ...base, tableId: candidates[0]?.id ?? 'none' }, tables);
    delete v.tableId;
    if (form.date && form.date < todayISO()) v.date = 'Choose today or a future date.';
    setErrors(v);
    if (Object.keys(v).length) return;
    if (candidates.length === 0) {
      setFormError(
        `We’re fully booked${form.zone !== 'Any' ? ` in the ${form.zone}` : ''} for ${form.guests} guests at ${formatTime(form.time)}. Try another time or seating area, or message us on WhatsApp.`
      );
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = addReservation({ ...base, tableId: candidates[0].id });
    setSubmitting(false);
    if (!result.ok) return setFormError(result.error);
    setDone(form);
  };

  return (
    <>
      <PageHero title="Reservations" subtitle="Book online and we’ll confirm by phone or WhatsApp." image={images.terrace} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-gold/15 bg-charcoal p-6 md:p-8">
          {done ?
          <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2Icon className="h-12 w-12 text-gold" />
              <h2 className="mt-4 font-display text-4xl font-semibold">Request received, {done.name.split(' ')[0]}</h2>
              <p className="mt-3 max-w-md text-muted">
                Table for {done.guests} on {formatDate(done.date)} at {formatTime(done.time)}. Your booking is <span className="text-gold">pending</span> — our team will confirm shortly.
              </p>
              <p className="mt-2 text-xs text-subtle">Demonstration prototype: this request is saved locally and no message is actually sent.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href={whatsappLink(`Hello Zeytoon, I just requested a table for ${done.guests} on ${formatDate(done.date)} at ${formatTime(done.time)} under ${done.name}.`)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-[#062e16]">
                  <MessageCircleIcon className="h-4 w-4" /> Confirm on WhatsApp
                </a>
                <Button variant="secondary" onClick={() => {setDone(null);setForm(initial);}}>Make another booking</Button>
              </div>
            </div> :

          <form onSubmit={submit} noValidate className="space-y-5">
              <h2 className="font-display text-3xl font-semibold">Book a table</h2>
              {formError &&
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" /> {formError}
                </div>
            }
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="bk-name" required error={errors.customerName} className="sm:col-span-2">
                  <input id="bk-name" autoComplete="name" className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
                </Field>
                <Field label="Phone number" htmlFor="bk-phone" required error={errors.phone}>
                  <input id="bk-phone" type="tel" autoComplete="tel" className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="0712 345 678" />
                </Field>
                <Field label="Email" htmlFor="bk-email" error={errors.email}>
                  <input id="bk-email" type="email" autoComplete="email" className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Date" htmlFor="bk-date" required error={errors.date}>
                  <input id="bk-date" type="date" min={todayISO()} className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} />
                </Field>
                <Field label="Time" htmlFor="bk-time" required error={errors.time}>
                  <input id="bk-time" type="time" step={900} className={inputClass} value={form.time} onChange={(e) => set('time', e.target.value)} />
                </Field>
                <Field label="Guests" htmlFor="bk-guests" required error={errors.guests}>
                  <input id="bk-guests" type="number" min={1} max={12} className={inputClass} value={form.guests || ''} onChange={(e) => set('guests', Number(e.target.value))} />
                </Field>
              </div>
              <Field label="Preferred seating" htmlFor="bk-zone">
                <select id="bk-zone" className={inputClass} value={form.zone} onChange={(e) => set('zone', e.target.value as BookingForm['zone'])}>
                  <option value="Any">No preference</option>
                  {tableZones.map((z) => <option key={z}>{z}</option>)}
                </select>
              </Field>
              <Field label="Special requests" htmlFor="bk-req">
                <textarea id="bk-req" rows={3} className={inputClass} value={form.requests} onChange={(e) => set('requests', e.target.value)} placeholder="Birthday, allergies, high chair…" />
              </Field>
              <Button type="submit" size="lg" loading={submitting} className="w-full">Request reservation</Button>
            </form>
          }
        </div>

        <aside className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold">Prefer WhatsApp?</h2>
            <p className="mt-2 text-sm text-muted">Message our reservations team on 0745 104 247 and we’ll hold a table for you.</p>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-[#062e16]">
              <MessageCircleIcon className="h-4 w-4" /> Reserve on WhatsApp
            </a>
          </div>
          <div className="border-t border-edge pt-6 text-sm text-muted">
            <h2 className="mb-2 font-display text-2xl font-semibold text-fg">Good to know</h2>
            <ul className="list-inside list-disc space-y-1.5">
              <li>Tables are held for 2 hours.</li>
              <li>Groups above 12 — please contact us for a VIP booth or private event.</li>
              <li>Smart-casual dress code after 7 PM.</li>
            </ul>
          </div>
          <img src={images.cocktail} alt="Zeytoon Gold signature cocktail" className="hidden aspect-[4/5] w-full rounded-2xl object-cover lg:block" />
        </aside>
      </section>
    </>);

}