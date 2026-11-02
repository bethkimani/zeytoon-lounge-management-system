import React from 'react';
import { Link } from 'react-router-dom';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { lounge, whatsappLink } from '../../data/lounge';

export function PublicFooter() {
  return (
    <footer className="border-t border-gold/15 bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-3xl font-semibold text-gold">Zeytoon Lounge</p>
          <p className="mt-3 max-w-xs text-sm text-muted">{lounge.tagline}. An evening destination off USIU Road, Nairobi.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-fg">Visit</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex gap-2"><MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {lounge.address}</li>
            <li><a href={`tel:+${lounge.whatsapp}`} className="flex gap-2 hover:text-gold"><PhoneIcon className="mt-0.5 h-4 w-4 text-gold" /> {lounge.phone}</a></li>
            <li><a href={`mailto:${lounge.email}`} className="flex gap-2 break-all hover:text-gold"><MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {lounge.email}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-fg">Hours</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {lounge.hours.map((h) =>
            <li key={h.days}><span className="block text-fg/80">{h.days}</span>{h.time}</li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-fg">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/menu" className="hover:text-gold">Menu</Link></li>
            <li><Link to="/events" className="hover:text-gold">Events</Link></li>
            <li><Link to="/reservations" className="hover:text-gold">Reservations</Link></li>
            <li><a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-gold">WhatsApp us</a></li>
            <li><Link to="/login" className="hover:text-gold">Staff login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-edge">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-subtle md:px-8">
          © {new Date().getFullYear()} Zeytoon Lounge · Demonstration prototype — events, prices and bookings shown are sample content.
        </p>
      </div>
    </footer>);

}