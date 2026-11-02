export type Role = 'Administrator' | 'Manager' | 'Supervisor' | 'Staff';

export type ModuleKey =
'dashboard' |
'reservations' |
'customers' |
'tables' |
'events' |
'inventory' |
'sales' |
'staff' |
'settings';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isDemo: boolean;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
export type ReservationSource = 'Phone' | 'Walk-in' | 'Website' | 'WhatsApp';

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  specialRequests: string;
  status: ReservationStatus;
  source: ReservationSource;
  createdAt: string;
  isDemo: boolean;
}

export type ReservationInput = Omit<Reservation, 'id' | 'customerId' | 'createdAt' | 'isDemo'>;

export type CustomerTier = 'Regular' | 'VIP';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferences: string;
  previousVisits: number;
  tier: CustomerTier;
  createdAt: string;
  isDemo: boolean;
}

export type CustomerInput = Omit<Customer, 'id' | 'createdAt' | 'isDemo'>;

export type TableStatus = 'Available' | 'Reserved' | 'Occupied';
export type TableZone = 'Main Lounge' | 'Terrace' | 'VIP Section' | 'Bar Counter';

export interface LoungeTable {
  id: string;
  number: number;
  capacity: number;
  zone: TableZone;
  status: TableStatus;
  assignedCustomer: string;
  isDemo: boolean;
}

export type EventCategory =
'Live Music' |
'DJ Night' |
'Dining Experience' |
'Comedy' |
'Sports Screening' |
'Themed Night';

export type EventStatus = 'Draft' | 'Upcoming' | 'Sold Out' | 'Completed' | 'Cancelled';

export interface LoungeEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
  image: string;
  ticketPrice: number;
  expectedAttendance: number;
  status: EventStatus;
  isDemo: boolean;
}

export type EventInput = Omit<LoungeEvent, 'id' | 'isDemo'>;

export type InventoryCategory =
'Spirits' |
'Wine' |
'Beer' |
'Soft Drinks' |
'Kitchen' |
'Shisha' |
'Supplies';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  threshold: number;
  isDemo: boolean;
}

export type InventoryInput = Omit<InventoryItem, 'id' | 'isDemo'>;

export type MovementType = 'Received' | 'Issued';

export interface StockMovement {
  id: string;
  itemId: string;
  type: MovementType;
  quantity: number;
  date: string;
  note: string;
  by: string;
}

export type PaymentMethod = 'M-Pesa' | 'Cash' | 'Card' | 'Bank Transfer';

export interface Sale {
  id: string;
  item: string;
  productId: string | null;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  date: string;
  servedBy: string;
  isDemo: boolean;
}

export type SaleInput = Omit<Sale, 'id' | 'total' | 'isDemo'>;

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  productId: string | null;
  stockPerUnit: number;
}

export type StaffStatus = 'Active' | 'On Leave' | 'Inactive';
export type ShiftType = 'Morning' | 'Evening' | 'Night' | 'Off';
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface StaffMember {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  status: StaffStatus;
  responsibilities: string[];
  shifts: Record<Weekday, ShiftType>;
  isDemo: boolean;
}

export type StaffInput = Omit<StaffMember, 'id' | 'isDemo'>;

export interface Activity {
  id: string;
  message: string;
  module: ModuleKey;
  at: string;
  by: string;
}

export type MenuCategory = 'Starters' | 'Mains' | 'Grill' | 'Cocktails' | 'Wines & Spirits' | 'Shisha';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string | null;
  featured: boolean;
}

export type ActionResult = {ok: true;} | {ok: false;error: string;};