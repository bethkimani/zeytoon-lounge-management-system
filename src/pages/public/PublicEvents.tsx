import React from 'react';
import { CalendarXIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { images } from '../../data/images';
import { todayISO } from '../../utils/format';
import { PageHero } from '../../components/public/PageHero';
import { PublicEventCard } from '../../components/public/PublicEventCard';
import { EmptyState } from '../../components/ui/EmptyState';

export function PublicEvents() {
  const { events } = useData();
  const upcoming = events.
  filter((e) => e.date >= todayISO() && (e.status === 'Upcoming' || e.status === 'Sold Out')).
  sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHero title="Events" subtitle="Live music, DJ nights, chef’s tables and themed evenings." image={images.dj} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {upcoming.length === 0 ?
        <EmptyState icon={CalendarXIcon} title="No events announced yet" description="Check back soon or message us on WhatsApp." /> :

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => <PublicEventCard key={e.id} event={e} />)}
          </div>
        }
      </section>
    </>);

}