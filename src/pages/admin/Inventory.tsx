import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangleIcon, MinusIcon, PackageSearchIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { InventoryItem, MovementType } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { inventoryCategories } from '../../data/inventory';
import { formatDateTime, formatKES } from '../../utils/format';
import { formatQty, isLowStock, stockStatus } from '../../utils/metrics';
import { cn } from '../../utils/cn';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { Segmented } from '../../components/ui/Segmented';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { DemoTag } from '../../components/ui/DemoTag';
import { Drawer } from '../../components/ui/Drawer';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { inputClass } from '../../components/ui/Field';
import { InventoryForm } from '../../components/admin/InventoryForm';
import { StockMovementForm } from '../../components/admin/StockMovementForm';

type Tab = 'stock' | 'history';

export function Inventory() {
  const { inventory, movements, deleteInventoryItem } = useData();
  const [tab, setTab] = useState<Tab>('stock');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [moveItem, setMoveItem] = useState<InventoryItem | null>(null);
  const [moveType, setMoveType] = useState<MovementType>('Received');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<InventoryItem | null>(null);

  const low = inventory.filter(isLowStock);
  const stockValue = inventory.reduce((s, i) => s + i.quantity * i.purchasePrice, 0);

  const totals = useMemo(() => {
    const map = new Map<string, {received: number;issued: number;}>();
    movements.forEach((m) => {
      const t = map.get(m.itemId) ?? { received: 0, issued: 0 };
      if (m.type === 'Received') t.received += m.quantity;else
      t.issued += m.quantity;
      map.set(m.itemId, t);
    });
    return map;
  }, [movements]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inventory.
    filter((i) => !category || i.category === category).
    filter((i) => !lowOnly || isLowStock(i)).
    filter((i) => !q || i.name.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q)).
    sort((a, b) => Number(isLowStock(b)) - Number(isLowStock(a)) || a.name.localeCompare(b.name));
  }, [inventory, category, lowOnly, search]);

  const detail = inventory.find((i) => i.id === detailId) ?? null;
  const itemName = (id: string) => inventory.find((i) => i.id === id)?.name ?? 'Removed product';

  const openMove = (item: InventoryItem, type: MovementType) => {
    setMoveType(type);
    setMoveItem(item);
  };

  const QuickActions = ({ item }: {item: InventoryItem;}) =>
  <div className="flex justify-end gap-1">
      <Button size="sm" variant="secondary" onClick={() => openMove(item, 'Received')} aria-label={`Receive ${item.name}`}>
        <PlusIcon className="h-3.5 w-3.5" /> Receive
      </Button>
      <Button size="sm" variant="ghost" onClick={() => openMove(item, 'Issued')} aria-label={`Issue ${item.name}`}>
        <MinusIcon className="h-3.5 w-3.5" /> Issue
      </Button>
    </div>;


  return (
    <>
      <PageHeader
        title="Inventory"
        description={`${inventory.length} products · ${formatKES(stockValue)} stock value at cost`}
        actions={
        <>
            <Segmented<Tab>
            label="Inventory view"
            value={tab}
            onChange={setTab}
            options={[
            { value: 'stock', label: 'Stock levels' },
            { value: 'history', label: 'Movement history', count: movements.length }]
            } />
          
            <Button onClick={() => {setEditing(null);setFormOpen(true);}}>
              <PlusIcon className="h-4 w-4" /> Add product
            </Button>
          </>
        } />
      

      {low.length > 0 && tab === 'stock' &&
      <div role="alert" className="mb-4 flex flex-col gap-3 rounded-2xl border border-danger/30 bg-danger/[0.06] px-4 py-3 sm:flex-row sm:items-center">
          <AlertTriangleIcon className="h-5 w-5 shrink-0 text-danger" />
          <p className="flex-1 text-sm text-fg">
            <span className="font-semibold">{low.length} products</span> at or below minimum:{' '}
            <span className="text-muted">{low.map((i) => i.name).join(', ')}</span>
          </p>
          <Button size="sm" variant="danger" onClick={() => setLowOnly(true)}>Show low stock</Button>
        </div>
      }

      {tab === 'history' ?
      <div className="rounded-2xl border border-edge bg-charcoal">
          {movements.length === 0 ?
        <EmptyState icon={PackageSearchIcon} title="No stock movements yet" /> :

        <ul className="divide-y divide-edge">
              {movements.slice(0, 100).map((m) =>
          <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                  <StatusBadge status={m.type} />
                  <span className="min-w-0 flex-1 text-sm text-fg">{itemName(m.itemId)}</span>
                  <span className={cn('text-sm font-medium tabular-nums', m.type === 'Received' ? 'text-ok' : 'text-info')}>
                    {m.type === 'Received' ? '+' : '−'}{formatQty(m.quantity)}
                  </span>
                  <span className="w-full text-xs text-subtle sm:w-auto">{m.note} · {m.by} · {formatDateTime(m.date)}</span>
                </li>
          )}
            </ul>
        }
        </div> :

      <div className="rounded-2xl border border-edge bg-charcoal">
          <div className="grid gap-3 border-b border-edge p-4 sm:grid-cols-[1fr_180px_auto]">
            <SearchInput value={search} onChange={setSearch} placeholder="Search product or supplier" />
            <select aria-label="Category" className={cn(inputClass, 'h-10 py-0')} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {inventoryCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-edge px-3 text-sm text-muted">
              <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} className="accent-[#D4AF37]" />
              Low stock only
            </label>
          </div>

          {rows.length === 0 ?
        <EmptyState icon={PackageSearchIcon} title="No products match" action={<Button variant="secondary" onClick={() => {setSearch('');setCategory('');setLowOnly(false);}}>Clear filters</Button>} /> :

        <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-edge text-left text-xs text-subtle">
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Available</th>
                      <th className="px-4 py-3 text-right font-medium">Buy / Sell</th>
                      <th className="px-4 py-3 text-right font-medium">Received / Issued</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-edge">
                    {rows.map((i) => {
                  const t = totals.get(i.id) ?? { received: 0, issued: 0 };
                  const pct = Math.min(100, i.quantity / Math.max(i.threshold * 3, 1) * 100);
                  const lowItem = isLowStock(i);
                  return (
                    <tr key={i.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3">
                            <button type="button" onClick={() => setDetailId(i.id)} className="text-left">
                              <span className="flex items-center gap-2 font-medium text-fg hover:text-gold">{i.name} {i.isDemo && <DemoTag />}</span>
                              <span className="text-xs text-subtle">{i.category} · {i.supplier}</span>
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <p className={cn('tabular-nums', lowItem ? 'text-danger' : 'text-fg')}>{formatQty(i.quantity)} <span className="text-xs text-subtle">{i.unit.toLowerCase()}</span></p>
                            <div className="mt-1 h-1 w-24 rounded-full bg-edge"><div className={cn('h-1 rounded-full', lowItem ? 'bg-danger' : 'bg-gold')} style={{ width: `${pct}%` }} /></div>
                            <p className="mt-0.5 text-[11px] text-subtle">Min {i.threshold}</p>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            <p className="text-muted">{formatKES(i.purchasePrice)}</p>
                            <p className="text-fg">{i.sellingPrice ? formatKES(i.sellingPrice) : '—'}</p>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            <p className="text-ok">+{formatQty(t.received)}</p>
                            <p className="text-info">−{formatQty(t.issued)}</p>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={stockStatus(i)} /></td>
                          <td className="px-4 py-3"><QuickActions item={i} /></td>
                        </tr>);

                })}
                  </tbody>
                </table>
              </div>
              <ul className="divide-y divide-edge lg:hidden">
                {rows.map((i) =>
            <li key={i.id} className="p-4">
                    <button type="button" onClick={() => setDetailId(i.id)} className="flex w-full items-start justify-between gap-3 text-left">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{i.name}</span>
                        <span className="text-xs text-subtle">{i.category} · {formatKES(i.sellingPrice)}</span>
                      </span>
                      <span className={cn('shrink-0 text-right tabular-nums', isLowStock(i) ? 'text-danger' : 'text-fg')}>
                        {formatQty(i.quantity)}
                        <span className="block text-[11px] text-subtle">{i.unit.toLowerCase()}</span>
                      </span>
                    </button>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusBadge status={stockStatus(i)} />
                      <QuickActions item={i} />
                    </div>
                  </li>
            )}
              </ul>
            </>
        }
        </div>
      }

      <Drawer
        open={!!detail}
        onClose={() => setDetailId(null)}
        title={detail?.name ?? ''}
        subtitle={detail ? `${detail.category} · ${detail.supplier}` : ''}
        footer={
        detail &&
        <>
              <Button variant="secondary" onClick={() => {setEditing(detail);setFormOpen(true);}}><PencilIcon className="h-4 w-4" /> Edit</Button>
              <Button variant="danger" onClick={() => setToDelete(detail)}><Trash2Icon className="h-4 w-4" /> Delete</Button>
            </>

        }>
        
        {detail &&
        <div className="space-y-6">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
            ['In stock', `${formatQty(detail.quantity)} ${detail.unit.toLowerCase()}`],
            ['Minimum', `${detail.threshold} ${detail.unit.toLowerCase()}`],
            ['Purchase price', formatKES(detail.purchasePrice)],
            ['Selling price', detail.sellingPrice ? formatKES(detail.sellingPrice) : 'Not for sale'],
            ['Margin', detail.sellingPrice ? formatKES(detail.sellingPrice - detail.purchasePrice) : '—'],
            ['Stock value', formatKES(detail.quantity * detail.purchasePrice)]].
            map(([k, v]) =>
            <div key={k} className="rounded-xl border border-edge p-3">
                  <dt className="text-xs text-subtle">{k}</dt>
                  <dd className="mt-0.5 text-fg">{v}</dd>
                </div>
            )}
            </dl>
            <QuickActions item={detail} />
            <section>
              <h3 className="mb-3 text-xs font-medium text-muted">Stock movement history</h3>
              {movements.filter((m) => m.itemId === detail.id).length === 0 ?
            <p className="text-sm text-subtle">No movements recorded.</p> :

            <ul className="divide-y divide-edge rounded-lg border border-edge">
                  {movements.filter((m) => m.itemId === detail.id).map((m) =>
              <li key={m.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm">{m.note}</p>
                        <p className="text-xs text-subtle">{m.by} · {formatDateTime(m.date)}</p>
                      </div>
                      <span className={cn('shrink-0 text-sm font-medium tabular-nums', m.type === 'Received' ? 'text-ok' : 'text-info')}>
                        {m.type === 'Received' ? '+' : '−'}{formatQty(m.quantity)}
                      </span>
                    </li>
              )}
                </ul>
            }
            </section>
          </div>
        }
      </Drawer>

      <InventoryForm open={formOpen} onClose={() => setFormOpen(false)} item={editing} />
      <StockMovementForm item={moveItem} initialType={moveType} onClose={() => setMoveItem(null)} />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete product?"
        message={toDelete ? `${toDelete.name} will be removed from inventory. Its movement history is kept.` : ''}
        onConfirm={() => {
          if (toDelete) {
            deleteInventoryItem(toDelete.id);
            setDetailId(null);
            toast.success('Product deleted');
          }
        }} />
      
    </>);

}