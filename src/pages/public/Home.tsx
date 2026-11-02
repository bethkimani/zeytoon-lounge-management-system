import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ClockIcon, MapPinIcon, MessageCircleIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { images } from '../../data/images';
import { menuItems } from '../../data/menu';
import { galleryImages } from '../../data/gallery';
import { lounge, whatsappLink } from '../../data/lounge';
import { formatKES, todayISO } from '../../utils/format';
import { PublicEventCard } from '../../components/public/PublicEventCard';

const ease = [0.23, 1, 0.32, 1] as const;

export function Home() {
  const { events } = useData();
  const upcoming = events.
  filter((e) => e.date >= todayISO() && (e.status === 'Upcoming' || e.status === 'Sold Out')).
  sort((a, b) => a.date.localeCompare(b.date)).
  slice(0, 3);
  const featured = menuItems.filter((m) => m.featured);

  return (
    <>
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img src={images.hero} alt="Zeytoon Lounge at night" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-night/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-night/50" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
            <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-fg sm:text-7xl md:text-8xl">
              Where Nairobi’s evenings <span className="text-gold">turn golden.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-fg/80">
              Fine dining, signature cocktails and live entertainment — tucked behind Safari Park Mall on USIU Road.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/reservations" className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-night transition-colors hover:bg-gold-soft">
                Reserve a table <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link to="/menu" className="inline-flex h-12 items-center rounded-full border border-fg/30 px-7 text-sm text-fg transition-colors hover:border-gold hover:text-gold">
                Explore the menu
              </Link>
            </div>
          </motion.div>
          <div className="mt-14 flex flex-col gap-4 border-t border-fg/15 pt-6 text-sm text-fg/80 sm:flex-row sm:gap-10">
            <span className="flex items-center gap-2"><MapPinIcon className="h-4 w-4 text-gold" /> USIU Road, behind Safari Park Mall</span>
            <span className="flex items-center gap-2"><ClockIcon className="h-4 w-4 text-gold" /> Open daily from 12:00 PM · Late on weekends</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-8">
        <img src={images.dining} alt="The Zeytoon dining room" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        <div>
          <h2 className="font-display text-5xl font-semibold leading-tight">A lounge built for long evenings.</h2>
          <p className="mt-5 text-muted">
            Zeytoon — Swahili for “olive” — brings together Coastal, Middle Eastern and modern grill cooking under one
            softly-lit roof. Start with a mezze board on the terrace, move to the dining room for nyama choma, and stay
            for the music.
          </p>
          <p className="mt-4 text-muted">Private booths for celebrations, a garden terrace for sundowners, and a stage that hosts Nairobi’s best live acts.</p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-soft">
            Our story <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-y border-gold/10 bg-charcoal py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-5xl font-semibold">From the kitchen & bar</h2>
            <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-soft">Full menu <ArrowRightIcon className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) =>
            <article key={item.id} className="flex flex-col">
                <img src={item.image ?? images.nyama} alt={item.name} className="aspect-[4/5] w-full rounded-2xl object-cover" />
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold">{item.name}</h3>
                  <span className="shrink-0 text-sm text-gold">{formatKES(item.price)}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-5xl font-semibold">Upcoming at Zeytoon</h2>
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-soft">All events <ArrowRightIcon className="h-4 w-4" /></Link>
        </div>
        {upcoming.length === 0 ?
        <p className="mt-8 text-muted">New events are announced soon — follow us on WhatsApp for updates.</p> :

        <div className="mt-10 grid gap-6 md:grid-cols-3">
            {upcoming.map((e) => <PublicEventCard key={e.id} event={e} />)}
          </div>
        }
      </section>

      <section aria-label="Gallery preview" className="pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 md:grid-cols-4 md:px-8">
          {galleryImages.slice(0, 4).map((g, i) =>
          <img key={g.id} src={g.src} alt={g.alt} className={`h-56 w-full rounded-2xl object-cover md:h-72 ${i === 0 ? 'md:col-span-2' : ''}`} />
          )}
        </div>
        <div className="mt-6 text-center">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-soft">View gallery <ArrowRightIcon className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-t border-gold/10 bg-charcoal">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-[1fr_1.3fr] md:px-8">
          <div>
            <h2 className="font-display text-5xl font-semibold">Find us</h2>
            <p className="mt-4 text-muted">{lounge.address}. Secure parking on site.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {lounge.hours.map((h) =>
              <li key={h.days} className="flex justify-between border-b border-edge pb-2"><span className="text-muted">{h.days}</span><span>{h.time}</span></li>
              )}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-[#062e16]">
                <MessageCircleIcon className="h-4 w-4" /> WhatsApp 0745 104 247
              </a>
              <a href={lounge.mapLink} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center rounded-full border border-gold/30 px-6 text-sm hover:border-gold">Get directions</a>
            </div>
          </div>
          <iframe title="Map to Zeytoon Lounge" src={lounge.mapEmbed} loading="lazy" className="h-80 w-full rounded-2xl border border-gold/15 grayscale invert-[0.9] hue-rotate-180 md:h-full md:min-h-[380px]" />
        </div>
      </section>
    </>);

}