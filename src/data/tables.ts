import type { LoungeTable } from '../types/models';

export const demoTables: LoungeTable[] = [
{ id: 't-01', number: 1, capacity: 4, zone: 'Main Lounge', status: 'Occupied', assignedCustomer: 'Peter Kariuki', isDemo: true },
{ id: 't-02', number: 2, capacity: 4, zone: 'Main Lounge', status: 'Available', assignedCustomer: '', isDemo: true },
{ id: 't-03', number: 3, capacity: 6, zone: 'Main Lounge', status: 'Reserved', assignedCustomer: 'Faith Njeri', isDemo: true },
{ id: 't-04', number: 4, capacity: 2, zone: 'Main Lounge', status: 'Available', assignedCustomer: '', isDemo: true },
{ id: 't-05', number: 5, capacity: 4, zone: 'Terrace', status: 'Reserved', assignedCustomer: 'Wanjiru Kamau', isDemo: true },
{ id: 't-06', number: 6, capacity: 6, zone: 'Terrace', status: 'Available', assignedCustomer: '', isDemo: true },
{ id: 't-07', number: 7, capacity: 8, zone: 'Terrace', status: 'Occupied', assignedCustomer: 'Ahmed Abdi', isDemo: true },
{ id: 't-08', number: 8, capacity: 10, zone: 'VIP Section', status: 'Reserved', assignedCustomer: 'Kevin Mwangi', isDemo: true },
{ id: 't-09', number: 9, capacity: 12, zone: 'VIP Section', status: 'Available', assignedCustomer: '', isDemo: true },
{ id: 't-10', number: 10, capacity: 2, zone: 'Bar Counter', status: 'Occupied', assignedCustomer: 'Samuel Mutua', isDemo: true },
{ id: 't-11', number: 11, capacity: 2, zone: 'Bar Counter', status: 'Available', assignedCustomer: '', isDemo: true },
{ id: 't-12', number: 12, capacity: 3, zone: 'Bar Counter', status: 'Available', assignedCustomer: '', isDemo: true }];


export const tableZones = ['Main Lounge', 'Terrace', 'VIP Section', 'Bar Counter'] as const;