import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type {
  ActionResult,
  Activity,
  Customer,
  CustomerInput,
  EventInput,
  InventoryInput,
  InventoryItem,
  LoungeEvent,
  LoungeTable,
  ModuleKey,
  MovementType,
  Reservation,
  ReservationInput,
  ReservationStatus,
  Sale,
  SaleInput,
  StaffInput,
  StaffMember,
  StockMovement } from
'../types/models';
import { useAuth } from './AuthContext';
import { demoReservations } from '../data/reservations';
import { demoCustomers } from '../data/customers';
import { demoTables } from '../data/tables';
import { demoEvents } from '../data/events';
import { demoInventory, demoMovements } from '../data/inventory';
import { demoSales, saleCatalog } from '../data/sales';
import { demoStaff } from '../data/staff';
import { demoActivities } from '../data/activities';
import { findConflict } from '../utils/reservations';
import { formatTime, normalizePhone, todayISO, uid } from '../utils/format';

const STORAGE_KEY = 'zeytoon-demo-data-v1';

interface DataState {
  seededOn: string;
  reservations: Reservation[];
  customers: Customer[];
  tables: LoungeTable[];
  events: LoungeEvent[];
  inventory: InventoryItem[];
  movements: StockMovement[];
  sales: Sale[];
  staff: StaffMember[];
  activities: Activity[];
}

type LoadStatus = 'loading' | 'ready' | 'error';

interface DataContextValue extends DataState {
  status: LoadStatus;
  addReservation: (input: ReservationInput) => ActionResult;
  updateReservation: (id: string, input: ReservationInput) => ActionResult;
  setReservationStatus: (id: string, status: ReservationStatus) => ActionResult;
  deleteReservation: (id: string) => void;
  addCustomer: (input: CustomerInput) => ActionResult;
  updateCustomer: (id: string, input: CustomerInput) => ActionResult;
  deleteCustomer: (id: string) => void;
  updateTable: (id: string, patch: Partial<LoungeTable>) => void;
  addEvent: (input: EventInput) => void;
  updateEvent: (id: string, input: EventInput) => void;
  deleteEvent: (id: string) => void;
  addInventoryItem: (input: InventoryInput) => ActionResult;
  updateInventoryItem: (id: string, input: InventoryInput) => void;
  deleteInventoryItem: (id: string) => void;
  recordMovement: (itemId: string, type: MovementType, quantity: number, note: string) => ActionResult;
  addSale: (input: SaleInput) => ActionResult;
  addStaff: (input: StaffInput) => void;
  updateStaff: (id: string, input: StaffInput) => void;
  deleteStaff: (id: string) => void;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

function createSeed(): DataState {
  return {
    seededOn: todayISO(),
    reservations: demoReservations,
    customers: demoCustomers,
    tables: demoTables,
    events: demoEvents,
    inventory: demoInventory,
    movements: demoMovements,
    sales: demoSales,
    staff: demoStaff,
    activities: demoActivities
  };
}

export function DataProvider({ children }: {children: React.ReactNode;}) {
  const { user } = useAuth();
  const actor = user?.name ?? 'Website';
  const [state, setState] = useState<DataState>(createSeed);
  const [status, setStatus] = useState<LoadStatus>('loading');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as DataState;
        // Demo data is anchored to "today" so the dashboard stays meaningful; refresh it daily.
        if (saved.seededOn === todayISO()) setState(saved);
      }
      setStatus('ready');
    } catch {
      setStatus('error');
      toast.error('Saved demo data could not be read. Fresh demonstration data has been loaded.');
      setState(createSeed());
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    if (status !== 'ready') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {

      /* storage full or unavailable — changes stay in memory */}
  }, [state, status]);

  const commit = (next: Partial<DataState>, message?: string, module: ModuleKey = 'dashboard') => {
    setState((prev) => ({
      ...prev,
      ...next,
      activities: message ?
      [{ id: uid('act'), message, module, at: new Date().toISOString(), by: actor }, ...prev.activities].slice(0, 60) :
      prev.activities
    }));
  };

  const tableLabel = (tableId: string) => `Table ${state.tables.find((t) => t.id === tableId)?.number ?? '?'}`;

  const resolveCustomer = (input: ReservationInput): {customerId: string;customers: Customer[];} => {
    const phone = normalizePhone(input.phone);
    const email = input.email.trim().toLowerCase();
    const existing = state.customers.find(
      (c) => normalizePhone(c.phone) === phone || email && c.email.toLowerCase() === email
    );
    if (existing) return { customerId: existing.id, customers: state.customers };
    const created: Customer = {
      id: uid('c'),
      name: input.customerName.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      preferences: input.specialRequests,
      previousVisits: 0,
      tier: 'Regular',
      createdAt: todayISO(),
      isDemo: false
    };
    return { customerId: created.id, customers: [created, ...state.customers] };
  };

  const conflictError = (conflict: Reservation) =>
  `${tableLabel(conflict.tableId)} is already held for ${conflict.customerName} at ${formatTime(conflict.time)}. Choose another table or a time at least 2 hours apart.`;

  const value: DataContextValue = {
    ...state,
    status,

    addReservation(input) {
      const conflict = findConflict(state.reservations, input);
      if (conflict) return { ok: false, error: conflictError(conflict) };
      const { customerId, customers } = resolveCustomer(input);
      const reservation: Reservation = {
        ...input,
        id: uid('r'),
        customerId,
        createdAt: todayISO(),
        isDemo: false
      };
      commit(
        { reservations: [reservation, ...state.reservations], customers },
        `New reservation for ${input.customerName} (${input.guests} guests, ${tableLabel(input.tableId)})`,
        'reservations'
      );
      return { ok: true };
    },

    updateReservation(id, input) {
      const conflict = findConflict(state.reservations, input, id);
      if (conflict) return { ok: false, error: conflictError(conflict) };
      const { customerId, customers } = resolveCustomer(input);
      commit(
        {
          reservations: state.reservations.map((r) => r.id === id ? { ...r, ...input, customerId } : r),
          customers
        },
        `Reservation for ${input.customerName} updated`,
        'reservations'
      );
      return { ok: true };
    },

    setReservationStatus(id, status) {
      const target = state.reservations.find((r) => r.id === id);
      if (!target) return { ok: false, error: 'Reservation not found.' };
      const conflict = findConflict(state.reservations, { ...target, status }, id);
      if (conflict) return { ok: false, error: conflictError(conflict) };
      commit(
        { reservations: state.reservations.map((r) => r.id === id ? { ...r, status } : r) },
        `${target.customerName}’s reservation marked ${status}`,
        'reservations'
      );
      return { ok: true };
    },

    deleteReservation(id) {
      const target = state.reservations.find((r) => r.id === id);
      commit(
        { reservations: state.reservations.filter((r) => r.id !== id) },
        target ? `Reservation for ${target.customerName} deleted` : undefined,
        'reservations'
      );
    },

    addCustomer(input) {
      const phone = normalizePhone(input.phone);
      if (state.customers.some((c) => normalizePhone(c.phone) === phone))
      return { ok: false, error: 'A customer with this phone number already exists.' };
      const customer: Customer = { ...input, id: uid('c'), createdAt: todayISO(), isDemo: false };
      commit({ customers: [customer, ...state.customers] }, `Customer ${input.name} added`, 'customers');
      return { ok: true };
    },

    updateCustomer(id, input) {
      const phone = normalizePhone(input.phone);
      if (state.customers.some((c) => c.id !== id && normalizePhone(c.phone) === phone))
      return { ok: false, error: 'Another customer already uses this phone number.' };
      commit(
        { customers: state.customers.map((c) => c.id === id ? { ...c, ...input } : c) },
        `Customer ${input.name} updated`,
        'customers'
      );
      return { ok: true };
    },

    deleteCustomer(id) {
      const target = state.customers.find((c) => c.id === id);
      commit(
        { customers: state.customers.filter((c) => c.id !== id) },
        target ? `Customer ${target.name} removed` : undefined,
        'customers'
      );
    },

    updateTable(id, patch) {
      const target = state.tables.find((t) => t.id === id);
      const next = state.tables.map((t) => t.id === id ? { ...t, ...patch } : t);
      const statusNote = patch.status ? ` marked ${patch.status}` : ' updated';
      const who = patch.assignedCustomer ? ` — ${patch.assignedCustomer}` : '';
      commit({ tables: next }, target ? `Table ${target.number}${statusNote}${who}` : undefined, 'tables');
    },

    addEvent(input) {
      const event: LoungeEvent = { ...input, id: uid('e'), isDemo: false };
      commit({ events: [...state.events, event] }, `Event “${input.name}” created`, 'events');
    },

    updateEvent(id, input) {
      commit(
        { events: state.events.map((e) => e.id === id ? { ...e, ...input } : e) },
        `Event “${input.name}” updated`,
        'events'
      );
    },

    deleteEvent(id) {
      const target = state.events.find((e) => e.id === id);
      commit(
        { events: state.events.filter((e) => e.id !== id) },
        target ? `Event “${target.name}” deleted` : undefined,
        'events'
      );
    },

    addInventoryItem(input) {
      if (state.inventory.some((i) => i.name.toLowerCase() === input.name.trim().toLowerCase()))
      return { ok: false, error: 'A product with this name already exists.' };
      const item: InventoryItem = { ...input, id: uid('inv'), isDemo: false };
      const movements =
      input.quantity > 0 ?
      [
      {
        id: uid('m'),
        itemId: item.id,
        type: 'Received' as const,
        quantity: input.quantity,
        date: new Date().toISOString(),
        note: 'Opening stock',
        by: actor
      },
      ...state.movements] :

      state.movements;
      commit({ inventory: [...state.inventory, item], movements }, `Product ${input.name} added to inventory`, 'inventory');
      return { ok: true };
    },

    updateInventoryItem(id, input) {
      commit(
        { inventory: state.inventory.map((i) => i.id === id ? { ...i, ...input } : i) },
        `Product ${input.name} updated`,
        'inventory'
      );
    },

    deleteInventoryItem(id) {
      const target = state.inventory.find((i) => i.id === id);
      commit(
        { inventory: state.inventory.filter((i) => i.id !== id) },
        target ? `Product ${target.name} removed` : undefined,
        'inventory'
      );
    },

    recordMovement(itemId, type, quantity, note) {
      const item = state.inventory.find((i) => i.id === itemId);
      if (!item) return { ok: false, error: 'Product not found.' };
      if (quantity <= 0) return { ok: false, error: 'Quantity must be greater than zero.' };
      if (type === 'Issued' && quantity > item.quantity)
      return { ok: false, error: `Only ${item.quantity} ${item.unit.toLowerCase()} in stock.` };
      const nextQty = +(type === 'Received' ? item.quantity + quantity : item.quantity - quantity).toFixed(2);
      const movement: StockMovement = {
        id: uid('m'),
        itemId,
        type,
        quantity,
        date: new Date().toISOString(),
        note,
        by: actor
      };
      commit(
        {
          inventory: state.inventory.map((i) => i.id === itemId ? { ...i, quantity: nextQty } : i),
          movements: [movement, ...state.movements]
        },
        `${item.name}: ${quantity} ${item.unit.toLowerCase()} ${type.toLowerCase()}`,
        'inventory'
      );
      return { ok: true };
    },

    addSale(input) {
      if (input.quantity <= 0) return { ok: false, error: 'Quantity must be at least 1.' };
      if (input.unitPrice <= 0) return { ok: false, error: 'Unit price must be greater than zero.' };
      let inventory = state.inventory;
      let movements = state.movements;
      if (input.productId) {
        const item = state.inventory.find((i) => i.id === input.productId);
        const perUnit = saleCatalog.find((c) => c.productId === input.productId)?.stockPerUnit ?? 1;
        const needed = +(input.quantity * perUnit).toFixed(2);
        if (item) {
          if (needed > item.quantity)
          return { ok: false, error: `Not enough stock: ${item.quantity} ${item.unit.toLowerCase()} of ${item.name} left.` };
          inventory = state.inventory.map((i) =>
          i.id === item.id ? { ...i, quantity: +(i.quantity - needed).toFixed(2) } : i
          );
          movements = [
          {
            id: uid('m'),
            itemId: item.id,
            type: 'Issued',
            quantity: needed,
            date: input.date,
            note: `Sale: ${input.quantity} × ${input.item}`,
            by: actor
          },
          ...state.movements];

        }
      }
      const sale: Sale = { ...input, id: uid('s'), total: input.quantity * input.unitPrice, isDemo: false };
      const sales = [sale, ...state.sales].sort((a, b) => b.date.localeCompare(a.date));
      commit(
        { sales, inventory, movements },
        `Sale recorded: ${input.quantity} × ${input.item} (${input.paymentMethod})`,
        'sales'
      );
      return { ok: true };
    },

    addStaff(input) {
      commit({ staff: [...state.staff, { ...input, id: uid('st'), isDemo: false }] }, `Staff member ${input.name} added`, 'staff');
    },

    updateStaff(id, input) {
      commit(
        { staff: state.staff.map((s) => s.id === id ? { ...s, ...input } : s) },
        `Staff record for ${input.name} updated`,
        'staff'
      );
    },

    deleteStaff(id) {
      const target = state.staff.find((s) => s.id === id);
      commit(
        { staff: state.staff.filter((s) => s.id !== id) },
        target ? `Staff member ${target.name} removed` : undefined,
        'staff'
      );
    },

    resetDemoData() {
      setState(createSeed());
      toast.success('Demonstration data restored.');
    }
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}