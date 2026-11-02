import type { LoungeTable, Reservation, ReservationInput } from '../types/models';
import { timeToMinutes } from './format';

/** A booking holds its table for this many minutes. */
export const SEATING_WINDOW_MINUTES = 120;

const ACTIVE_STATUSES = ['Pending', 'Confirmed'];

export function findConflict(
reservations: Reservation[],
candidate: Pick<ReservationInput, 'tableId' | 'date' | 'time' | 'status'>,
excludeId?: string)
: Reservation | undefined {
  if (!ACTIVE_STATUSES.includes(candidate.status)) return undefined;
  const start = timeToMinutes(candidate.time);
  return reservations.find(
    (r) =>
    r.id !== excludeId &&
    r.tableId === candidate.tableId &&
    r.date === candidate.date &&
    ACTIVE_STATUSES.includes(r.status) &&
    Math.abs(timeToMinutes(r.time) - start) < SEATING_WINDOW_MINUTES
  );
}

export type ReservationErrors = Partial<Record<keyof ReservationInput, string>>;

export function validateReservation(input: ReservationInput, tables: LoungeTable[]): ReservationErrors {
  const errors: ReservationErrors = {};
  if (input.customerName.trim().length < 3) errors.customerName = 'Enter the guest’s full name.';
  if (!/^(\+?254|0)[17]\d{8}$/.test(input.phone.replace(/\s/g, '')))
  errors.phone = 'Use a Kenyan number, e.g. 0712 345 678.';
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = 'Enter a valid email address.';
  if (!input.date) errors.date = 'Choose a date.';
  if (!input.time) errors.time = 'Choose a time.';else
  {
    const minutes = timeToMinutes(input.time);
    if (minutes < 12 * 60 && minutes > 2 * 60) errors.time = 'We seat guests from 12:00 PM to 2:00 AM.';
  }
  if (!input.guests || input.guests < 1) errors.guests = 'At least 1 guest.';
  if (input.guests > 40) errors.guests = 'For groups above 40, arrange a private event.';
  if (!input.tableId) errors.tableId = 'Select a table.';else
  {
    const table = tables.find((t) => t.id === input.tableId);
    if (table && input.guests > table.capacity)
    errors.tableId = `Table ${table.number} seats ${table.capacity}. Pick a larger table.`;
  }
  return errors;
}