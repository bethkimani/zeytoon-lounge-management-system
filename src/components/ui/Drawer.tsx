import React, { useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const ease = [0.23, 1, 0.32, 1] as const;

export function Drawer({ open, onClose, title, subtitle, children, footer }: DrawerProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-40">
          <motion.div
          className="absolute inset-0 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease }}
          className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-gold/20 bg-charcoal">
          
            <div className="flex items-start justify-between gap-4 border-b border-edge px-5 py-4">
              <div className="min-w-0">
                <h2 id={titleId} className="truncate font-display text-2xl font-semibold">
                  {title}
                </h2>
                {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-fg">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer && <div className="flex flex-wrap gap-2 border-t border-edge px-5 py-4">{footer}</div>}
          </motion.aside>
        </div>
      }
    </AnimatePresence>);

}