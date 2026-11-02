import type { AppUser } from '../types/models';

export const demoUsers: AppUser[] = [
{ id: 'u-01', name: 'Amani Wekesa', email: 'admin@zeytoon.demo', password: 'demo1234', role: 'Administrator', isDemo: true },
{ id: 'u-02', name: 'Halima Yusuf', email: 'manager@zeytoon.demo', password: 'demo1234', role: 'Manager', isDemo: true },
{ id: 'u-03', name: 'Collins Odhiambo', email: 'supervisor@zeytoon.demo', password: 'demo1234', role: 'Supervisor', isDemo: true },
{ id: 'u-04', name: 'Joy Nduta', email: 'staff@zeytoon.demo', password: 'demo1234', role: 'Staff', isDemo: true }];