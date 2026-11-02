import React, { useState } from 'react';
import { PlusIcon, ReceiptIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { canAccess } from '../../utils/permissions';
import { todayISO } from '../../utils/format';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SalesHeroPanel } from '../../components/dashboard/SalesHeroPanel';
import { TodayBookings } from '../../components/dashboard/TodayBookings';
import { KpiStrip } from '../../components/dashboard/KpiStrip';
import { WeeklyRevenueChart } from '../../components/dashboard/WeeklyRevenueChart';
import { ReservationTrendChart } from '../../components/dashboard/ReservationTrendChart';
import { PopularProducts } from '../../components/dashboard/PopularProducts';
import { LowStockList } from '../../components/dashboard/LowStockList';
import { UpcomingEventsList } from '../../components/dashboard/UpcomingEventsList';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { ReservationForm } from '../../components/admin/ReservationForm';
import { SaleForm } from '../../components/admin/SaleForm';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const { user } = useAuth();
  const { reservations, customers, tables, sales, inventory, events, activities } = useData();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  if (!user) return null;

  const showSales = canAccess(user.role, 'sales');
  const showInventory = canAccess(user.role, 'inventory');
  const upcomingCount = reservations.filter((r) => r.date >= todayISO() && r.status !== 'Cancelled').length;
  const occupied = tables.filter((t) => t.status === 'Occupied').length;

  const kpis = [
  { label: 'Total reservations', value: reservations.length, hint: `${upcomingCount} upcoming` },
  { label: 'Confirmed', value: reservations.filter((r) => r.status === 'Confirmed').length, hint: 'Ready to seat' },
  { label: 'Pending', value: reservations.filter((r) => r.status === 'Pending').length, hint: 'Awaiting confirmation' },
  { label: 'Total customers', value: customers.length, hint: `${customers.filter((c) => c.tier === 'VIP').length} VIP guests` }];


  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user.name.split(' ')[0]}`}
        description={`${occupied} of ${tables.length} tables occupied right now.`}
        actions={
        <>
            {showSales &&
          <Button variant="secondary" onClick={() => setSaleOpen(true)}>
                <ReceiptIcon className="h-4 w-4" /> Record sale
              </Button>
          }
            <Button onClick={() => setBookingOpen(true)}>
              <PlusIcon className="h-4 w-4" /> New reservation
            </Button>
          </>
        } />
      

      <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            {showSales ? <SalesHeroPanel sales={sales} /> : <ReservationTrendChart reservations={reservations} />}
          </div>
          <TodayBookings reservations={reservations} tables={tables} />
        </div>

        <KpiStrip items={kpis} />

        {showSales &&
        <div className="grid gap-4 lg:grid-cols-2">
            <WeeklyRevenueChart sales={sales} />
            <ReservationTrendChart reservations={reservations} />
          </div>
        }

        <div className="grid gap-4 lg:grid-cols-3">
          {showSales && <PopularProducts sales={sales} />}
          {showInventory && <LowStockList inventory={inventory} />}
          <UpcomingEventsList events={events} />
          {!showSales && <ActivityFeed activities={activities} />}
        </div>

        {showSales && <ActivityFeed activities={activities} />}
      </div>

      <ReservationForm open={bookingOpen} onClose={() => setBookingOpen(false)} />
      {showSales && <SaleForm open={saleOpen} onClose={() => setSaleOpen(false)} />}
    </>);

}