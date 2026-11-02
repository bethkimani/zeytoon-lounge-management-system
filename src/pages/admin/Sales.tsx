import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DownloadIcon, ReceiptIcon, SearchXIcon } from 'lucide-react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import type { PaymentMethod } from '../../types/models';
import { useData } from '../../contexts/DataContext';
import { paymentMethods } from '../../data/sales';
import { formatCompactKES, formatDateTime, formatKES } from '../../utils/format';
import { paymentBreakdown, periodStart, popularProducts, salesByDay, salesByHour, salesInPeriod, sumSales } from '../../utils/metrics';
import type { Period } from '../../utils/metrics';
import { exportToCSV } from '../../utils/csv';
import { cn } from '../../utils/cn';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Segmented } from '../../components/ui/Segmented';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { DemoTag } from '../../components/ui/DemoTag';
import { inputClass } from '../../components/ui/Field';
import { ChartTooltip } from '../../components/charts/ChartTooltip';
import { SaleForm } from '../../components/admin/SaleForm';

const periodLabel: Record<Period, string> = { day: 'Today', week: 'This week', month: 'This month' };

export function Sales() {
  const { sales } = useData();
  const [period, setPeriod] = useState<Period>('day');
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState<'' | PaymentMethod>('');
  const [limit, setLimit] = useState(25);
  const [formOpen, setFormOpen] = useState(false);

  const inPeriod = useMemo(() => salesInPeriod(sales, period), [sales, period]);
  const revenue = sumSales(inPeriod);
  const avg = inPeriod.length ? revenue / inPeriod.length : 0;
  const breakdown = paymentBreakdown(inPeriod);
  const top = popularProducts(inPeriod, 5);

  const chartData = useMemo(() => {
    if (period === 'day') return salesByHour(inPeriod);
    const days = differenceInCalendarDays(new Date(), periodStart(period)) + 1;
    return salesByDay(sales, days).map((d) => ({ label: d.label, total: d.total }));
  }, [period, inPeriod, sales]);

  const transactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inPeriod.
    filter((s) => !method || s.paymentMethod === method).
    filter((s) => !q || s.item.toLowerCase().includes(q) || s.servedBy.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }, [inPeriod, method, search]);

  const exportTransactions = () => {
    if (!transactions.length) return toast.error('No transactions to export.');
    exportToCSV(
      `zeytoon-sales-${period}-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      transactions.map((s) => ({
        'Transaction ID': s.id,
        Date: format(parseISO(s.date), 'yyyy-MM-dd HH:mm'),
        Item: s.item,
        Category: s.category,
        Quantity: s.quantity,
        'Unit price (KES)': s.unitPrice,
        'Total (KES)': s.total,
        'Payment method': s.paymentMethod,
        'Served by': s.servedBy,
        'Record type': s.isDemo ? 'Demonstration data' : 'Entered in prototype'
      }))
    );
    toast.success(`${transactions.length} transactions exported`);
  };

  const exportSummary = () => {
    const days = salesByDay(sales, 30);
    exportToCSV(
      `zeytoon-daily-summary-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      days.map((d) => ({ Date: d.key, Transactions: d.count, 'Revenue (KES)': d.total, 'Average ticket (KES)': d.count ? Math.round(d.total / d.count) : 0 }))
    );
    toast.success('30-day summary exported');
  };

  return (
    <>
      <PageHeader
        title="Sales & reports"
        description="Record transactions and review revenue. All figures in Kenyan Shillings and based on demonstration data."
        actions={
        <>
            <Button variant="secondary" onClick={exportSummary}><DownloadIcon className="h-4 w-4" /> 30-day summary</Button>
            <Button onClick={() => setFormOpen(true)}><ReceiptIcon className="h-4 w-4" /> Record sale</Button>
          </>
        } />
      

      <Segmented<Period>
        label="Summary period"
        value={period}
        onChange={(p) => {setPeriod(p);setLimit(25);}}
        className="mb-4"
        options={[
        { value: 'day', label: 'Daily' },
        { value: 'week', label: 'Weekly' },
        { value: 'month', label: 'Monthly' }]
        } />
      

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-gold/20 bg-charcoal p-5 md:p-6 xl:col-span-2" aria-label={`${periodLabel[period]} revenue`}>
          <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
            <div>
              <p className="text-sm text-muted">{periodLabel[period]} revenue</p>
              <p className="mt-1 font-display text-5xl font-semibold tracking-tight">{formatKES(revenue)}</p>
            </div>
            <div className="flex gap-8 pb-1">
              <div>
                <p className="text-xs text-subtle">Transactions</p>
                <p className="text-xl font-semibold tabular-nums">{inPeriod.length}</p>
              </div>
              <div>
                <p className="text-xs text-subtle">Average ticket</p>
                <p className="text-xl font-semibold tabular-nums">{formatKES(avg)}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 h-60">
            {inPeriod.length === 0 ?
            <EmptyState icon={ReceiptIcon} title="No sales in this period yet" /> :

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="#262626" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} interval={period === 'month' ? 3 : 0} />
                  <YAxis tickFormatter={(v: number) => formatCompactKES(v).replace('KES ', '')} tickLine={false} axisLine={false} width={48} />
                  <Tooltip content={<ChartTooltip currency />} cursor={{ fill: 'rgba(212,175,55,0.06)' }} />
                  <Bar dataKey="total" name="Revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            }
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-edge bg-charcoal p-5" aria-labelledby="pay-methods">
            <h2 id="pay-methods" className="text-sm font-semibold">Payment methods</h2>
            <ul className="mt-4 space-y-3">
              {breakdown.map((b) =>
              <li key={b.method}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{b.method}</span>
                    <span className="tabular-nums">{formatKES(b.value)} <span className="text-xs text-subtle">{Math.round(b.share * 100)}%</span></span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-edge"><div className="h-1 rounded-full bg-gold" style={{ width: `${b.share * 100}%` }} /></div>
                </li>
              )}
            </ul>
          </section>
          <section className="rounded-2xl border border-edge bg-charcoal p-5" aria-labelledby="top-items">
            <h2 id="top-items" className="text-sm font-semibold">Top sellers</h2>
            {top.length === 0 ?
            <p className="mt-3 text-sm text-subtle">No sales yet.</p> :

            <ol className="mt-3 space-y-2.5">
                {top.map((p, i) =>
              <li key={p.name} className="flex items-center gap-3 text-sm">
                    <span className="w-4 text-xs text-gold">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-subtle">{p.quantity} sold</span>
                    <span className="w-24 text-right tabular-nums">{formatKES(p.revenue)}</span>
                  </li>
              )}
              </ol>
            }
          </section>
        </div>
      </div>

      <section className="mt-4 rounded-2xl border border-edge bg-charcoal" aria-labelledby="transactions">
        <div className="flex flex-col gap-3 border-b border-edge p-4 lg:flex-row lg:items-center">
          <h2 id="transactions" className="text-sm font-semibold lg:mr-auto">Transactions · {periodLabel[period].toLowerCase()}</h2>
          <SearchInput value={search} onChange={setSearch} placeholder="Search item, category or staff" className="lg:w-72" />
          <div className="flex gap-3">
            <select aria-label="Payment method" className={cn(inputClass, 'h-10 py-0 lg:w-44')} value={method} onChange={(e) => setMethod(e.target.value as '' | PaymentMethod)}>
              <option value="">All payment methods</option>
              {paymentMethods.map((m) => <option key={m}>{m}</option>)}
            </select>
            <Button variant="secondary" onClick={exportTransactions}><DownloadIcon className="h-4 w-4" /> Export CSV</Button>
          </div>
        </div>
        {transactions.length === 0 ?
        <EmptyState icon={SearchXIcon} title="No transactions found" description="Change the period, search or payment filter." /> :

        <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-edge text-left text-xs text-subtle">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 text-right font-medium">Qty</th>
                    <th className="px-4 py-3 text-right font-medium">Unit price</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Served by</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                  {transactions.slice(0, limit).map((s) =>
                <tr key={s.id} className="hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted">{formatDateTime(s.date)}</td>
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-2">{s.item} {s.isDemo && <DemoTag />}</span>
                        <span className="text-xs text-subtle">{s.category}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{s.quantity}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted">{formatKES(s.unitPrice)}</td>
                      <td className="px-4 py-2.5 text-right font-medium tabular-nums">{formatKES(s.total)}</td>
                      <td className="px-4 py-2.5 text-muted">{s.paymentMethod}</td>
                      <td className="px-4 py-2.5 text-muted">{s.servedBy}</td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gold/20">
                    <td colSpan={4} className="px-4 py-3 text-xs text-muted">{transactions.length} transactions</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-gold">{formatKES(sumSales(transactions))}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
            {transactions.length > limit &&
          <div className="border-t border-edge p-3 text-center">
                <Button variant="ghost" onClick={() => setLimit((l) => l + 50)}>Show more ({transactions.length - limit} remaining)</Button>
              </div>
          }
          </>
        }
      </section>

      <SaleForm open={formOpen} onClose={() => setFormOpen(false)} />
    </>);

}