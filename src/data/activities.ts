import type { Activity } from '../types/models';

const now = new Date();
const subMinutes = (date: Date, minutes: number) => new Date(date.getTime() - minutes * 60000);

export const demoActivities: Activity[] = [
{ id: 'a-01', message: 'Reservation for Mercy Chebet (8 guests) received via WhatsApp', module: 'reservations', at: subMinutes(now, 18).toISOString(), by: 'Joy Nduta' },
{ id: 'a-02', message: 'Guinness 500ml issued to main bar — 18 bottles', module: 'inventory', at: subMinutes(now, 52).toISOString(), by: 'Collins Odhiambo' },
{ id: 'a-03', message: 'Table 1 marked Occupied — Peter Kariuki', module: 'tables', at: subMinutes(now, 75).toISOString(), by: 'Joy Nduta' },
{ id: 'a-04', message: 'Daniel Ochieng’s lunch reservation completed', module: 'reservations', at: subMinutes(now, 140).toISOString(), by: 'Collins Odhiambo' },
{ id: 'a-05', message: 'Event “The Gold & Black Gala” published', module: 'events', at: subMinutes(now, 300).toISOString(), by: 'Halima Yusuf' },
{ id: 'a-06', message: 'Low stock: Hennessy VS 700ml at 4 bottles', module: 'inventory', at: subMinutes(now, 420).toISOString(), by: 'System' }];