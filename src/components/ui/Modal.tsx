import React, { useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'md' | 'lg';
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const ease = [0.23, 1, 0.32, 1] as const;

export function Modal({ open, onClose, title, description, size = 'md', footer, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.22, ease }}
          className={cn(
            'relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-gold/20 bg-charcoal shadow-2xl sm:rounded-2xl',
            size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg'
          )}>
          
            <div className="flex items-start justify-between gap-4 border-b border-edge px-5 py-4 sm:px-6">
              <div>
                <h2 id={titleId} className="font-display text-2xl font-semibold text-fg">
                  {title}
                </h2>
                {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/5 hover:text-fg">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
            {footer &&
          <div className="flex flex-wrap justify-end gap-2 border-t border-edge px-5 py-4 sm:px-6">{footer}</div>
          }
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}