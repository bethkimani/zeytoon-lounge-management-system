import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArmchairIcon, BarChart3Icon, CalendarCheckIcon, ChevronsLeftIcon, ContactIcon, ExternalLinkIcon, LayoutDashboardIcon, LogOutIcon, PackageIcon, SettingsIcon, TicketIcon, UsersIcon, XIcon, BoxIcon } from "lucide-react";
import { ModuleKey } from "../../types/models";
import { useAuth } from "../../contexts/AuthContext";
import { canAccess, MODULE_LABELS } from "../../utils/permissions";
import { initials } from "../../utils/format";
import { cn } from "../../utils/cn";
interface NavItem {
  module: ModuleKey;
  to: string;
  icon: BoxIcon;
}
const navItems: NavItem[] = [{
  module: 'dashboard',
  to: '/admin',
  icon: LayoutDashboardIcon
}, {
  module: 'reservations',
  to: '/admin/reservations',
  icon: CalendarCheckIcon
}, {
  module: 'tables',
  to: '/admin/tables',
  icon: ArmchairIcon
}, {
  module: 'customers',
  to: '/admin/customers',
  icon: UsersIcon
}, {
  module: 'events',
  to: '/admin/events',
  icon: TicketIcon
}, {
  module: 'inventory',
  to: '/admin/inventory',
  icon: PackageIcon
}, {
  module: 'sales',
  to: '/admin/sales',
  icon: BarChart3Icon
}, {
  module: 'staff',
  to: '/admin/staff',
  icon: ContactIcon
}, {
  module: 'settings',
  to: '/admin/settings',
  icon: SettingsIcon
}];
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}
export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile
}: SidebarProps) {
  return <>
      <aside className={cn('sticky top-0 hidden h-screen shrink-0 border-r border-edge bg-charcoal transition-[width] duration-200 ease-out lg:block', collapsed ? 'w-[76px]' : 'w-64')}>
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      <AnimatePresence>
        {mobileOpen && <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div className="absolute inset-0 bg-black/70" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.2
        }} onClick={onCloseMobile} />
            <motion.aside initial={{
          x: '-100%'
        }} animate={{
          x: 0
        }} exit={{
          x: '-100%'
        }} transition={{
          duration: 0.25,
          ease: [0.23, 1, 0.32, 1]
        }} className="absolute left-0 top-0 h-full w-72 border-r border-gold/20 bg-charcoal">
              <button type="button" onClick={onCloseMobile} aria-label="Close menu" className="absolute right-3 top-5 rounded-lg p-1.5 text-muted hover:text-fg">
                <XIcon className="h-5 w-5" />
              </button>
              <SidebarContent collapsed={false} />
            </motion.aside>
          </div>}
      </AnimatePresence>
    </>;
}
function SidebarContent({
  collapsed,
  onToggle



}: {collapsed: boolean;onToggle?: () => void;}) {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const items = navItems.filter((item) => user && canAccess(user.role, item.module));
  return <div className="flex h-full flex-col">
      <div className={cn('flex h-[72px] items-center gap-3 px-5', collapsed && 'justify-center px-0')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-lg font-semibold text-gold">
          Z
        </div>
        {!collapsed && <div className="min-w-0">
            <p className="font-display text-xl font-semibold leading-none text-fg">Zeytoon</p>
            <p className="mt-1 text-[11px] text-subtle">Lounge Management</p>
          </div>}
      </div>

      <nav aria-label="Management" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {items.map(({
        module,
        to,
        icon: Icon
      }) => <NavLink key={module} to={to} end={to === '/admin'} title={collapsed ? MODULE_LABELS[module] : undefined} className={({
        isActive
      }) => cn('group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150', collapsed && 'justify-center px-0', isActive ? 'bg-gold/10 text-gold' : 'text-muted hover:bg-white/[0.04] hover:text-fg')}>
            {({
          isActive
        }) => <>
                {isActive && <span className="absolute left-0 top-2 h-6 w-0.5 rounded-full bg-gold" aria-hidden="true" />}
                <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                {!collapsed && <span className="truncate">{MODULE_LABELS[module]}</span>}
              </>}
          </NavLink>)}
      </nav>

      <div className="space-y-1 border-t border-edge p-3">
        <a href="/" target="_blank" rel="noreferrer" title={collapsed ? 'View public website' : undefined} className={cn('flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-muted transition-colors hover:bg-white/[0.04] hover:text-fg', collapsed && 'justify-center px-0')}>
          <ExternalLinkIcon className="h-4 w-4 shrink-0" />
          {!collapsed && 'Public website'}
        </a>
        {user && <div className={cn('flex items-center gap-3 rounded-lg px-2 py-2', collapsed && 'flex-col px-0')}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-raised text-xs font-semibold text-gold">
              {initials(user.name)}
            </div>
            {!collapsed && <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-fg">{user.name}</p>
                <p className="truncate text-xs text-subtle">{user.role}</p>
              </div>}
            <button type="button" onClick={() => {
          logout();
          navigate('/login');
        }} aria-label="Log out" title="Log out" className="rounded-lg p-1.5 text-subtle transition-colors hover:bg-white/5 hover:text-danger">
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>}
        {onToggle && <button type="button" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className={cn('flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-subtle transition-colors hover:bg-white/[0.04] hover:text-fg', collapsed && 'justify-center px-0')}>
            <ChevronsLeftIcon className={cn('h-4 w-4 transition-transform duration-200', collapsed && 'rotate-180')} />
            {!collapsed && 'Collapse'}
          </button>}
      </div>
    </div>;
}