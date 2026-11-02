import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const links = [
{ to: '/', label: 'Home' },
{ to: '/about', label: 'About' },
{ to: '/menu', label: 'Menu' },
{ to: '/events', label: 'Events' },
{ to: '/gallery', label: 'Gallery' },
{ to: '/contact', label: 'Contact' }];


export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const overHero = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-200',
        overHero ? 'border-b border-transparent bg-transparent' : 'border-b border-gold/15 bg-night/90 backdrop-blur'
      )}>
      
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Zeytoon Lounge home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 font-display text-xl font-semibold text-gold">Z</span>
          <span className="font-display text-2xl font-semibold tracking-wide text-fg">Zeytoon</span>
        </Link>
        <nav aria-label="Main" className="ml-auto hidden items-center gap-7 lg:flex">
          {links.map((l) =>
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => cn('text-sm transition-colors duration-150', isActive ? 'text-gold' : 'text-fg/80 hover:text-fg')}>
            
              {l.label}
            </NavLink>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link to="/login" className="hidden text-sm text-muted hover:text-fg sm:block">Staff login</Link>
          <Link
            to="/reservations"
            className="hidden h-10 items-center rounded-full bg-gold px-5 text-sm font-semibold text-night transition-colors hover:bg-gold-soft sm:inline-flex">
            
            Book a table
          </Link>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-fg lg:hidden">
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open &&
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-night px-6 py-6 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-semibold text-gold">Zeytoon</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-2">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
              {links.map((l) =>
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => cn('py-3 font-display text-4xl', isActive ? 'text-gold' : 'text-fg')}>
                  {l.label}
                </NavLink>
            )}
            </nav>
            <div className="mt-auto grid gap-3">
              <Link to="/reservations" className="flex h-12 items-center justify-center rounded-full bg-gold font-semibold text-night">Book a table</Link>
              <Link to="/login" className="flex h-12 items-center justify-center rounded-full border border-gold/30 text-sm text-fg">Staff login</Link>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}