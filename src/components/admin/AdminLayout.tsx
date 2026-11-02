import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { FlaskConicalIcon, MenuIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { PageSkeleton } from '../ui/PageSkeleton';

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { status } = useData();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full bg-night text-fg">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-edge bg-night/90 px-4 backdrop-blur md:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-fg lg:hidden">
            
            <MenuIcon className="h-5 w-5" />
          </button>
          <p className="hidden text-sm text-muted sm:block">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
          <div className="ml-auto flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-xs text-gold"
              title="All records in this prototype are fictional demonstration data. No live customer, payment or booking systems are connected.">
              
              <FlaskConicalIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Demonstration prototype · sample data</span>
              <span className="sm:hidden">Demo</span>
            </span>
            {user &&
            <span className="hidden rounded-full border border-edge px-3 py-1 text-xs text-muted md:inline">
                {user.role}
              </span>
            }
          </div>
        </header>
        <main className="w-full flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-[1400px]">{status === 'loading' ? <PageSkeleton /> : <Outlet />}</div>
        </main>
      </div>
    </div>);

}