import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircleIcon } from 'lucide-react';
import type { InventoryItem, MovementType } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { formatQty } from '../../utils/metrics';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { Segmented } from '../ui/Segmented';

interface StockMovementFormProps {
  item: InventoryItem | null;
  initialType: MovementType;
  onClose: () => void;
}

export function StockMovementForm({ item, initialType, onClose }: StockMovementFormProps) {
  const { recordMovement } = useData();
  const [type, setType] = useState<MovementType>(initialType);
  const [quantity, setQuantity] = useState<number>(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    setType(initialType);
    setQuantity(0);
    setNote('');
    setError(null);
  }, [item, initialType]);

  const after = item ? type === 'Received' ? item.quantity + (quantity || 0) : item.quantity - (quantity || 0) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    const result = recordMovement(item.id, type, quantity, note.trim() || (type === 'Received' ? 'Stock received' : 'Stock issued'));
    if (!result.ok) return setError(result.error);
    toast.success(`${item.name}: ${formatQty(quantity)} ${type.toLowerCase()}`);
    onClose();
  };

  return (
    <Modal
      open={!!item}
      onClose={onClose}
      title="Update stock"
      description={item?.name}
      footer={
      <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="movement-form">Record {type.toLowerCase()}</Button>
        </>
      }>
      
      {item &&
      <form id="movement-form" onSubmit={submit} noValidate className="space-y-4">
          <Segmented<MovementType>
          label="Movement type"
          value={type}
          onChange={(t) => {setType(t);setError(null);}}
          options={[
          { value: 'Received', label: 'Stock received' },
          { value: 'Issued', label: 'Stock issued' }]
          } />
        
          {error &&
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
              <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
        }
          <Field label={`Quantity (${item.unit.toLowerCase()})`} htmlFor="mv-qty" required>
            <input id="mv-qty" type="number" min={0} step="any" autoFocus className={inputClass} value={quantity || ''} onChange={(e) => {setQuantity(Number(e.target.value));setError(null);}} />
          </Field>
          <Field label="Note" htmlFor="mv-note" hint="Invoice number, destination or reason.">
            <input id="mv-note" className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder={type === 'Received' ? 'e.g. Invoice HS-1023' : 'e.g. Issued to main bar'} />
          </Field>
          <div className="flex items-center justify-between rounded-xl border border-edge px-4 py-3 text-sm">
            <span className="text-muted">Current → after</span>
            <span className="tabular-nums">
              {formatQty(item.quantity)} → <span className={after < 0 ? 'text-danger' : after <= item.threshold ? 'text-warn' : 'text-ok'}>{formatQty(+after.toFixed(2))}</span> {item.unit.toLowerCase()}
            </span>
          </div>
        </form>
      }
    </Modal>);

}