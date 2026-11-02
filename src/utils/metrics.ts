import {
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subWeeks,
  addDays } from
'date-fns';
import type { Customer, InventoryItem, PaymentMethod, Reservation, Sale } from '../types/models';
import { toISODate } from './format';

export type Period = 'day' | 'week' | 'month';

export function periodStart(period: Period, now = new Date()): Date {
  if (period === 'day') return startOfDay(now);
  if (period === 'week') return startOfWeek(now, { weekStartsOn: 1 });
  return startOfMonth(now);
}

export function salesInPeriod(sales: Sale[], period: Period): Sale[] {
  const start = periodStart(period);
  const end = endOfDay(new Date());
  return sales.filter((s) => isWithinInterval(parseISO(s.date), { start, end }));
}

export function sumSales(sales: Sale[]): number {
  return sales.reduce((sum, s) => sum + s.total, 0);
}

export function salesByDay(sales: Sale[], days: number) {
  const now = new Date();
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = subDays(now, days - 1 - i);
    return { key: toISODate(d), label: format(d, 'EEE d'), total: 0, count: 0 };
  });
  const index = new Map(buckets.map((b, i) => [b.key, i]));
  sales.forEach((s) => {
    const i = index.get(toISODate(parseISO(s.date)));
    if (i !== undefined) {
      buckets[i].total += s.total;
      buckets[i].count += 1;
    }
  });
  return buckets;
}

export function salesByHour(sales: Sale[]) {
  const buckets = Array.from({ length: 24 }, (_, h) => ({ label: `${String(h).padStart(2, '0')}:00`, total: 0 }));
  sales.forEach((s) => {
    buckets[parseISO(s.date).getHours()].total += s.total;
  });
  return buckets.filter((_, h) => h >= 10 || h <= 3);
}

export function revenueByWeek(sales: Sale[], weeks: number) {
  const now = new Date();
  return Array.from({ length: weeks }, (_, i) => {
    const start = startOfWeek(subWeeks(now, weeks - 1 - i), { weekStartsOn: 1 });
    const end = endOfDay(addDays(start, 6));
    const total = sales.
    filter((s) => isWithinInterval(parseISO(s.date), { start, end })).
    reduce((sum, s) => sum + s.total, 0);
    return { label: format(start, 'd MMM'), total };
  });
}

export function reservationTrend(reservations: Reservation[], from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, i) => {
    const d = addDays(new Date(), from + i);
    const key = toISODate(d);
    const day = reservations.filter((r) => r.date === key);
    return {
      label: format(d, 'EEE d'),
      Confirmed: day.filter((r) => r.status === 'Confirmed').length,
      Pending: day.filter((r) => r.status === 'Pending').length,
      Completed: day.filter((r) => r.status === 'Completed').length,
      Cancelled: day.filter((r) => r.status === 'Cancelled').length
    };
  });
}

export function popularProducts(sales: Sale[], limit: number) {
  const map = new Map<string, {name: string;quantity: number;revenue: number;}>();
  sales.forEach((s) => {
    const entry = map.get(s.item) ?? { name: s.item, quantity: 0, revenue: 0 };
    entry.quantity += s.quantity;
    entry.revenue += s.total;
    map.set(s.item, entry);
  });
  return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export function paymentBreakdown(sales: Sale[]) {
  const methods: PaymentMethod[] = ['M-Pesa', 'Card', 'Cash', 'Bank Transfer'];
  const total = sumSales(sales) || 1;
  return methods.map((m) => {
    const value = sumSales(sales.filter((s) => s.paymentMethod === m));
    return { method: m, value, share: value / total };
  });
}

export function isLowStock(item: InventoryItem): boolean {
  return item.quantity <= item.threshold;
}

export function stockStatus(item: InventoryItem): 'Out of stock' | 'Low stock' | 'In stock' {
  if (item.quantity <= 0) return 'Out of stock';
  return isLowStock(item) ? 'Low stock' : 'In stock';
}

export function customerReservations(customer: Customer, reservations: Reservation[]): Reservation[] {
  return reservations.
  filter((r) => r.customerId === customer.id).
  sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
}

export function customerVisits(customer: Customer, reservations: Reservation[]): number {
  return customer.previousVisits + reservations.filter((r) => r.customerId === customer.id && r.status === 'Completed').length;
}

export function formatQty(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}