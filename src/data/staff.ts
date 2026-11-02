import type { StaffMember, Weekday } from '../types/models';

export const weekdays: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const shiftTimes = {
  Morning: '10:00 – 16:00',
  Evening: '16:00 – 23:00',
  Night: '20:00 – 03:00',
  Off: 'Off'
} as const;

export const demoStaff: StaffMember[] = [
{ id: 'st-01', name: 'Halima Yusuf', position: 'General Manager', phone: '0700 100 201', email: 'halima.yusuf@example.com', status: 'Active', responsibilities: ['Operations', 'Supplier relations', 'Reporting'], shifts: { Mon: 'Morning', Tue: 'Morning', Wed: 'Morning', Thu: 'Evening', Fri: 'Evening', Sat: 'Evening', Sun: 'Off' }, isDemo: true },
{ id: 'st-02', name: 'Collins Odhiambo', position: 'Floor Supervisor', phone: '0700 100 202', email: 'collins.odhiambo@example.com', status: 'Active', responsibilities: ['Floor management', 'Reservations', 'Staff rota'], shifts: { Mon: 'Off', Tue: 'Evening', Wed: 'Evening', Thu: 'Evening', Fri: 'Night', Sat: 'Night', Sun: 'Evening' }, isDemo: true },
{ id: 'st-03', name: 'Chef Omar Salim', position: 'Head Chef', phone: '0700 100 203', email: 'omar.salim@example.com', status: 'Active', responsibilities: ['Kitchen', 'Menu design', 'Food cost'], shifts: { Mon: 'Morning', Tue: 'Morning', Wed: 'Off', Thu: 'Evening', Fri: 'Evening', Sat: 'Evening', Sun: 'Morning' }, isDemo: true },
{ id: 'st-04', name: 'Brenda Akinyi', position: 'Head Mixologist', phone: '0700 100 204', email: 'brenda.akinyi@example.com', status: 'Active', responsibilities: ['Bar', 'Cocktail menu', 'Bar stock'], shifts: { Mon: 'Off', Tue: 'Off', Wed: 'Evening', Thu: 'Evening', Fri: 'Night', Sat: 'Night', Sun: 'Evening' }, isDemo: true },
{ id: 'st-05', name: 'Joy Nduta', position: 'Hostess', phone: '0700 100 205', email: 'joy.nduta@example.com', status: 'Active', responsibilities: ['Guest welcome', 'Table assignment'], shifts: { Mon: 'Evening', Tue: 'Evening', Wed: 'Off', Thu: 'Evening', Fri: 'Night', Sat: 'Night', Sun: 'Off' }, isDemo: true },
{ id: 'st-06', name: 'Moses Kibet', position: 'Waiter', phone: '0700 100 206', email: 'moses.kibet@example.com', status: 'Active', responsibilities: ['Terrace section', 'Order taking'], shifts: { Mon: 'Morning', Tue: 'Off', Wed: 'Morning', Thu: 'Morning', Fri: 'Evening', Sat: 'Evening', Sun: 'Morning' }, isDemo: true },
{ id: 'st-07', name: 'Sharon Wairimu', position: 'Waitress', phone: '0700 100 207', email: 'sharon.wairimu@example.com', status: 'On Leave', responsibilities: ['VIP section', 'Bottle service'], shifts: { Mon: 'Off', Tue: 'Off', Wed: 'Off', Thu: 'Off', Fri: 'Off', Sat: 'Off', Sun: 'Off' }, isDemo: true },
{ id: 'st-08', name: 'DJ Sheks Mwakio', position: 'Resident DJ', phone: '0700 100 208', email: 'sheks.mwakio@example.com', status: 'Active', responsibilities: ['Music programming', 'Event sets'], shifts: { Mon: 'Off', Tue: 'Off', Wed: 'Off', Thu: 'Night', Fri: 'Night', Sat: 'Night', Sun: 'Off' }, isDemo: true },
{ id: 'st-09', name: 'Patrick Njoroge', position: 'Security Lead', phone: '0700 100 209', email: 'patrick.njoroge@example.com', status: 'Active', responsibilities: ['Door policy', 'Guest safety'], shifts: { Mon: 'Evening', Tue: 'Evening', Wed: 'Evening', Thu: 'Night', Fri: 'Night', Sat: 'Night', Sun: 'Off' }, isDemo: true }];


export const staffPositions = [
'General Manager',
'Floor Supervisor',
'Head Chef',
'Sous Chef',
'Head Mixologist',
'Bartender',
'Hostess',
'Waiter',
'Waitress',
'Resident DJ',
'Security Lead',
'Cashier'];