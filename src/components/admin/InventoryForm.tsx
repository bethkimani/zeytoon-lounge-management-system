import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { InventoryCategory, InventoryInput, InventoryItem } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { inventoryCategories } from '../../data/inventory';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';

interface InventoryFormProps {
  open: boolean;
  onClose: () => void;
  item?: InventoryItem | null;
}

type Errors = Partial<Record<keyof InventoryInput, string>>;

const empty: InventoryInput = { name: '', category: 'Spirits', quantity: 0, unit: 'Bottles', purchasePrice: 0, sellingPrice: 0, supplier: '', threshold: 5 };

export function InventoryForm({ open, onClose, item }: InventoryFormProps) {
  const { addInventoryItem, updateInventoryItem } = useData();
  const [form, setForm] = useState<InventoryInput>(empty);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (item) {
      const { id: _id, isDemo: _d, ...rest } = item;
      setForm(rest);
    } else setForm(empty);
  }, [open, item]);

  const set = <K extends keyof InventoryInput,>(k: K, v: InventoryInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: Errors = {};
    if (form.name.trim().length < 2) v.name = 'Enter a product name.';
    if (!form.unit.trim()) v.unit = 'Enter a unit, e.g. Bottles.';
    if (form.quantity < 0) v.quantity = 'Cannot be negative.';
    if (form.purchasePrice < 0) v.purchasePrice = 'Cannot be negative.';
    if (form.sellingPrice < 0) v.sellingPrice = 'Cannot be negative.';
    if (form.threshold < 0) v.threshold = 'Cannot be negative.';
    if (!form.supplier.trim()) v.supplier = 'Enter the supplier.';
    if (Object.keys(v).length) return setErrors(v);
    if (item) {
      updateInventoryItem(item.id, form);
      toast.success('Product updated');
    } else {
      const r = addInventoryItem(form);
      if (!r.ok) return setErrors({ name: r.error });
      toast.success(`${form.name} added`);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={item ? 'Edit product' : 'Add product'}
      description={item ? 'To change quantity, record stock received or issued so history stays accurate.' : undefined}
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="inventory-form">{item ? 'Save changes' : 'Add product'}</Button>
        </>
      }>
      
      <form id="inventory-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" htmlFor="iv-name" required error={errors.name} className="sm:col-span-2">
          <input id="iv-name" className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Category" htmlFor="iv-cat">
          <select id="iv-cat" className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value as InventoryCategory)}>
            {inventoryCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Unit of measurement" htmlFor="iv-unit" required error={errors.unit}>
          <input id="iv-unit" className={inputClass} value={form.unit} onChange={(e) => set('unit', e.target.value)} placeholder="Bottles, Kg, Packs…" />
        </Field>
        {!item &&
        <Field label="Opening quantity" htmlFor="iv-qty" error={errors.quantity}>
            <input id="iv-qty" type="number" min={0} className={inputClass} value={form.quantity} onChange={(e) => set('quantity', Number(e.target.value))} />
          </Field>
        }
        <Field label="Low-stock threshold" htmlFor="iv-thr" error={errors.threshold} hint="Alert when quantity falls to this level.">
          <input id="iv-thr" type="number" min={0} className={inputClass} value={form.threshold} onChange={(e) => set('threshold', Number(e.target.value))} />
        </Field>
        <Field label="Purchase price (KES)" htmlFor="iv-buy" error={errors.purchasePrice}>
          <input id="iv-buy" type="number" min={0} className={inputClass} value={form.purchasePrice} onChange={(e) => set('purchasePrice', Number(e.target.value))} />
        </Field>
        <Field label="Selling price (KES)" htmlFor="iv-sell" error={errors.sellingPrice} hint="Use 0 for non-sale supplies.">
          <input id="iv-sell" type="number" min={0} className={inputClass} value={form.sellingPrice} onChange={(e) => set('sellingPrice', Number(e.target.value))} />
        </Field>
        <Field label="Supplier" htmlFor="iv-sup" required error={errors.supplier} className="sm:col-span-2">
          <input id="iv-sup" className={inputClass} value={form.supplier} onChange={(e) => set('supplier', e.target.value)} />
        </Field>
      </form>
    </Modal>);

}