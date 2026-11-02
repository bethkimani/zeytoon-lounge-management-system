import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircleIcon } from 'lucide-react';
import type { PaymentMethod } from '../../types/models';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { paymentMethods, saleCatalog } from '../../data/sales';
import { formatKES } from '../../utils/format';
import { formatQty } from '../../utils/metrics';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
}

const CUSTOM = 'custom';

function nowLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function SaleForm({ open, onClose }: SaleFormProps) {
  const { user } = useAuth();
  const { addSale, inventory } = useData();
  const [catalogId, setCatalogId] = useState(saleCatalog[0].id);
  const [customName, setCustomName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(saleCatalog[0].unitPrice);
  const [method, setMethod] = useState<PaymentMethod>('M-Pesa');
  const [when, setWhen] = useState(nowLocal());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setCatalogId(saleCatalog[0].id);
    setCustomName('');
    setQuantity(1);
    setUnitPrice(saleCatalog[0].unitPrice);
    setMethod('M-Pesa');
    setWhen(nowLocal());
    setError(null);
  }, [open]);

  const selected = saleCatalog.find((c) => c.id === catalogId);
  const linkedStock = selected?.productId ? inventory.find((i) => i.id === selected.productId) : undefined;
  const total = (quantity || 0) * (unitPrice || 0);

  const chooseItem = (id: string) => {
    setCatalogId(id);
    setError(null);
    const item = saleCatalog.find((c) => c.id === id);
    if (item) setUnitPrice(item.unitPrice);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (catalogId === CUSTOM && customName.trim().length < 2) {
      setError('Enter the product or service name.');
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError('Quantity must be a whole number of at least 1.');
      return;
    }
    const result = addSale({
      item: catalogId === CUSTOM ? customName.trim() : selected!.name,
      productId: catalogId === CUSTOM ? null : selected!.productId,
      category: catalogId === CUSTOM ? 'Other' : selected!.category,
      quantity,
      unitPrice,
      paymentMethod: method,
      date: new Date(when).toISOString(),
      servedBy: user?.name ?? 'Staff'
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success(`Sale recorded · ${formatKES(total)}`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record sale"
      description="Linked products are deducted from inventory automatically."
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="sale-form">Record {formatKES(total)}</Button>
        </>
      }>
      
      <form id="sale-form" onSubmit={submit} noValidate className="space-y-4">
        {error &&
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        }
        <Field
          label="Product or service"
          htmlFor="sale-item"
          required
          hint={linkedStock ? `${formatQty(linkedStock.quantity)} ${linkedStock.unit.toLowerCase()} in stock` : undefined}>
          
          <select id="sale-item" className={inputClass} value={catalogId} onChange={(e) => chooseItem(e.target.value)}>
            {['Food', 'Cocktails', 'Spirits', 'Wine', 'Beer', 'Soft Drinks', 'Shisha', 'Services'].map((cat) =>
            <optgroup key={cat} label={cat}>
                {saleCatalog.filter((c) => c.category === cat).map((c) =>
              <option key={c.id} value={c.id}>{c.name} — {formatKES(c.unitPrice)}</option>
              )}
              </optgroup>
            )}
            <option value={CUSTOM}>Other (custom item)…</option>
          </select>
        </Field>
        {catalogId === CUSTOM &&
        <Field label="Item name" htmlFor="sale-custom" required>
            <input id="sale-custom" className={inputClass} value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Private room hire" />
          </Field>
        }
        <div className="grid grid-cols-2 gap-4">
          <Field label="Quantity" htmlFor="sale-qty" required>
            <input id="sale-qty" type="number" min={1} className={inputClass} value={quantity || ''} onChange={(e) => setQuantity(Number(e.target.value))} />
          </Field>
          <Field label="Unit price (KES)" htmlFor="sale-price" required>
            <input id="sale-price" type="number" min={1} className={inputClass} value={unitPrice || ''} onChange={(e) => setUnitPrice(Number(e.target.value))} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Payment method" htmlFor="sale-method">
            <select id="sale-method" className={inputClass} value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
              {paymentMethods.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Transaction date" htmlFor="sale-date">
            <input id="sale-date" type="datetime-local" className={inputClass} value={when} onChange={(e) => setWhen(e.target.value)} />
          </Field>
        </div>
        <div className="flex items-baseline justify-between rounded-xl border border-gold/25 bg-gold/5 px-4 py-3">
          <span className="text-sm text-muted">Total amount</span>
          <span className="font-display text-3xl font-semibold text-gold">{formatKES(total)}</span>
        </div>
        <p className="text-xs text-subtle">Demonstration only — no real payment is processed.</p>
      </form>
    </Modal>);

}