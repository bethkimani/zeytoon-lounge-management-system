import React from 'react';
import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { PageHero } from '../../components/public/PageHero';

const spaces = [
{ name: 'The Dining Room', text: 'Velvet booths and candlelit tables for long dinners and business evenings.', image: images.dining },
{ name: 'The Garden Terrace', text: 'Open-air sundowners under string lights, with shisha and the grill close by.', image: images.terrace },
{ name: 'The Bar', text: 'A backlit wall of spirits and a cocktail list built around East African ingredients.', image: images.bar }];


export function About() {
  return (
    <>
      <PageHero title="About Zeytoon" subtitle="A Nairobi lounge for dining, music and late conversations." image={images.dining} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.2fr] md:px-8">
        <h2 className="font-display text-5xl font-semibold leading-tight">Rooted in hospitality, tuned for the night.</h2>
        <div className="space-y-5 text-muted">
          <p>
            Zeytoon Lounge sits along USIU Road, just behind Safari Park Mall — close enough to the city to drop by after
            work, far enough to feel like an escape. We set out to create a place where a family lunch, a corporate dinner
            and a Saturday night out all feel at home.
          </p>
          <p>
            Our kitchen draws on the Swahili coast, the Middle East and the Kenyan grill. Our bar pours classic and
            signature cocktails alongside a cellar of wines and premium spirits. And our stage hosts jazz, DJs, comedy and
            themed nights throughout the week.
          </p>
          <Link to="/reservations" className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-night hover:bg-gold-soft">
            Reserve your table
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <h2 className="font-display text-4xl font-semibold">Our spaces</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {spaces.map((s) =>
          <article key={s.name}>
              <img src={s.image} alt={s.name} className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <h3 className="mt-4 font-display text-2xl font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </article>
          )}
        </div>
      </section>
    </>);

}