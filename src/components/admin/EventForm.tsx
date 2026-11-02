import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { EventCategory, EventInput, EventStatus, LoungeEvent } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { eventCategories, eventStatuses } from '../../data/events';
import { eventImageLibrary } from '../../data/images';
import { daysFromToday } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  event?: LoungeEvent | null;
}

type Errors = Partial<Record<keyof EventInput, string>>;

const empty = (): EventInput => ({
  name: '',
  description: '',
  date: daysFromToday(7),
  startTime: '20:00',
  endTime: '23:00',
  category: 'Live Music',
  image: eventImageLibrary[0].url,
  ticketPrice: 0,
  expectedAttendance: 100,
  status: 'Upcoming'
});

export function EventForm({ open, onClose, event }: EventFormProps) {
  const { addEvent, updateEvent } = useData();
  const [form, setForm] = useState<EventInput>(empty());
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (event) {
      const { id: _id, isDemo: _d, ...rest } = event;
      setForm(rest);
    } else setForm(empty());
  }, [open, event]);

  const set = <K extends keyof EventInput,>(k: K, v: EventInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Errors = {};
    if (form.name.trim().length < 3) v.name = 'Give the event a name.';
    if (form.description.trim().length < 10) v.description = 'Add a short description (10+ characters).';
    if (!form.date) v.date = 'Choose a date.';
    if (!form.startTime) v.startTime = 'Required.';
    if (!form.endTime) v.endTime = 'Required.';
    if (form.ticketPrice < 0) v.ticketPrice = 'Price cannot be negative.';
    if (form.expectedAttendance < 1) v.expectedAttendance = 'At least 1.';
    if (!/^https?:\/\//.test(form.image)) v.image = 'Use a full image URL or pick one below.';
    if (Object.keys(v).length) return setErrors(v);
    if (event) updateEvent(event.id, form);else
    addEvent(form);
    toast.success(event ? 'Event updated' : `“${form.name}” created`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={event ? 'Edit event' : 'Create event'}
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="event-form">{event ? 'Save changes' : 'Create event'}</Button>
        </>
      }>
      
      <form id="event-form" onSubmit={submit} noValidate className="space-y-4">
        <Field label="Event name" htmlFor="ev-name" required error={errors.name}>
          <input id="ev-name" className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Description" htmlFor="ev-desc" required error={errors.description}>
          <textarea id="ev-desc" rows={3} className={inputClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Date" htmlFor="ev-date" required error={errors.date}>
            <input id="ev-date" type="date" className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} />
          </Field>
          <Field label="Start time" htmlFor="ev-start" required error={errors.startTime}>
            <input id="ev-start" type="time" className={inputClass} value={form.startTime} onChange={(e) => set('startTime', e.target.value)} />
          </Field>
          <Field label="End time" htmlFor="ev-end" required error={errors.endTime}>
            <input id="ev-end" type="time" className={inputClass} value={form.endTime} onChange={(e) => set('endTime', e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="ev-cat">
            <select id="ev-cat" className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value as EventCategory)}>
              {eventCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status" htmlFor="ev-status">
            <select id="ev-status" className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value as EventStatus)}>
              {eventStatuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Ticket price (KES)" htmlFor="ev-price" hint="Use 0 for free entry." error={errors.ticketPrice}>
            <input id="ev-price" type="number" min={0} step={100} className={inputClass} value={form.ticketPrice} onChange={(e) => set('ticketPrice', Number(e.target.value))} />
          </Field>
          <Field label="Expected attendance" htmlFor="ev-att" error={errors.expectedAttendance}>
            <input id="ev-att" type="number" min={1} className={inputClass} value={form.expectedAttendance} onChange={(e) => set('expectedAttendance', Number(e.target.value))} />
          </Field>
        </div>
        <Field label="Promotional image URL" htmlFor="ev-img" error={errors.image}>
          <input id="ev-img" className={inputClass} value={form.image} onChange={(e) => set('image', e.target.value)} />
        </Field>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Image library">
          {eventImageLibrary.map((img) =>
          <button
            key={img.url}
            type="button"
            role="radio"
            aria-checked={form.image === img.url}
            aria-label={img.label}
            onClick={() => set('image', img.url)}
            className={cn('overflow-hidden rounded-lg border-2 transition-colors', form.image === img.url ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100')}>
            
              <img src={img.url} alt="" className="aspect-square w-full object-cover" />
            </button>
          )}
        </div>
      </form>
    </Modal>);

}