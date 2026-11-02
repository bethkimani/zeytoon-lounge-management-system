import type { ModuleKey, Role } from '../types/models';

export const ROLES: Role[] = ['Administrator', 'Manager', 'Supervisor', 'Staff'];

export const ROLE_ACCESS: Record<Role, ModuleKey[]> = {
  Administrator: ['dashboard', 'reservations', 'customers', 'tables', 'events', 'inventory', 'sales', 'staff', 'settings'],
  Manager: ['dashboard', 'reservations', 'customers', 'tables', 'events', 'inventory', 'sales', 'staff', 'settings'],
  Supervisor: ['dashboard', 'reservations', 'customers', 'tables', 'staff', 'settings'],
  Staff: ['dashboard', 'reservations', 'tables', 'settings']
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Administrator: 'Full access, including user accounts and role assignment.',
  Manager: 'All operational modules plus sales and reporting.',
  Supervisor: 'Reservations, tables, customers and staff operations.',
  Staff: 'Day-to-day reservations and table status only.'
};

export const MODULE_LABELS: Record<ModuleKey, string> = {
  dashboard: 'Dashboard',
  reservations: 'Reservations',
  customers: 'Customers',
  tables: 'Tables',
  events: 'Events',
  inventory: 'Inventory',
  sales: 'Sales & Reports',
  staff: 'Staff',
  settings: 'Settings'
};

export function canAccess(role: Role, module: ModuleKey): boolean {
  return ROLE_ACCESS[role].includes(module);
}

export function canManageUsers(role: Role): boolean {
  return role === 'Administrator';
}

export function canEditStaff(role: Role): boolean {
  return role === 'Administrator' || role === 'Manager';
}