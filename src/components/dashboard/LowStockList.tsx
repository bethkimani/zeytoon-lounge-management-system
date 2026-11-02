import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangleIcon, PackageCheckIcon } from 'lucide-react';
import type { InventoryItem } from '../../types/models';
import { formatQty, isLowStock } from '../../utils/metrics';
import { EmptyState } from '../ui/EmptyState';

export function LowStockList({ inventory }: {inventory: InventoryItem[];}) {
  const low = inventory.filter(isLowStock).sort((a, b) => a.quantity / a.threshold - b.quantity / b.threshold);
  return (
    <section className="rounded-2xl border border-danger/25 bg-charcoal" aria-labelledby="low-stock">
      <header className="flex items-center justify-between px-5 pt-5">
        <h2 id="low-stock" className="flex items-center gap-2 text-sm font-semibold text-fg">
          <AlertTriangleIcon className="h-4 w-4 text-danger" /> Low-stock alerts
          {low.length > 0 &&
          <span className="rounded-full bg-danger/15 px-2 text-xs font-medium text-danger">{low.length}</span>
          }
        </h2>
        <Link to="/admin/inventory" className="text-sm text-gold hover:text-gold-soft">Restock</Link>
      </header>
      {low.length === 0 ?
      <EmptyState icon={PackageCheckIcon} title="All stock above minimum" /> :

      <ul className="space-y-3 p-5">
          {low.slice(0, 5).map((item) => {
          const pct = Math.min(100, item.quantity / item.threshold * 100);
          return (
            <li key={item.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate text-fg">{item.name}</span>
                  <span className="shrink-0 tabular-nums text-danger">
                    {formatQty(item.quantity)} / {item.threshold}
                  </span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-edge">
                  <div className="h-1 rounded-full bg-danger" style={{ width: `${pct}%` }} />
                </div>
              </li>);

        })}
        </ul>
      }
    </section>);

}