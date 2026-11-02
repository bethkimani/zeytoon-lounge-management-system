import type { CatalogItem, PaymentMethod, Sale } from '../types/models';

export const saleCatalog: CatalogItem[] = [
{ id: 'cat-01', name: 'Johnnie Walker Black (bottle)', category: 'Spirits', unitPrice: 7500, productId: 'inv-01', stockPerUnit: 1 },
{ id: 'cat-02', name: 'Hennessy VS (bottle)', category: 'Spirits', unitPrice: 10500, productId: 'inv-02', stockPerUnit: 1 },
{ id: 'cat-03', name: 'Tusker Lager', category: 'Beer', unitPrice: 350, productId: 'inv-03', stockPerUnit: 1 },
{ id: 'cat-04', name: 'Guinness', category: 'Beer', unitPrice: 380, productId: 'inv-04', stockPerUnit: 1 },
{ id: 'cat-05', name: 'Four Cousins Red (bottle)', category: 'Wine', unitPrice: 2800, productId: 'inv-05', stockPerUnit: 1 },
{ id: 'cat-06', name: 'Moët & Chandon Brut', category: 'Wine', unitPrice: 16000, productId: 'inv-06', stockPerUnit: 1 },
{ id: 'cat-07', name: 'Coca-Cola', category: 'Soft Drinks', unitPrice: 200, productId: 'inv-07', stockPerUnit: 1 },
{ id: 'cat-08', name: 'Red Bull', category: 'Soft Drinks', unitPrice: 400, productId: 'inv-08', stockPerUnit: 1 },
{ id: 'cat-09', name: 'Shisha Session', category: 'Shisha', unitPrice: 1800, productId: 'inv-09', stockPerUnit: 0.25 },
{ id: 'cat-10', name: 'Beef Fillet Steak', category: 'Food', unitPrice: 2600, productId: 'inv-10', stockPerUnit: 0.3 },
{ id: 'cat-11', name: 'Grilled Tilapia', category: 'Food', unitPrice: 1500, productId: 'inv-11', stockPerUnit: 1 },
{ id: 'cat-12', name: 'Nyama Choma Platter', category: 'Food', unitPrice: 3200, productId: null, stockPerUnit: 0 },
{ id: 'cat-13', name: 'Zeytoon Mezze Board', category: 'Food', unitPrice: 1800, productId: null, stockPerUnit: 0 },
{ id: 'cat-14', name: 'Spiced Chicken Wings', category: 'Food', unitPrice: 1200, productId: null, stockPerUnit: 0 },
{ id: 'cat-15', name: 'Zeytoon Gold Cocktail', category: 'Cocktails', unitPrice: 950, productId: null, stockPerUnit: 0 },
{ id: 'cat-16', name: 'Classic Mojito', category: 'Cocktails', unitPrice: 850, productId: null, stockPerUnit: 0 },
{ id: 'cat-17', name: 'Event Ticket', category: 'Services', unitPrice: 1500, productId: null, stockPerUnit: 0 },
{ id: 'cat-18', name: 'VIP Booth Package', category: 'Services', unitPrice: 25000, productId: null, stockPerUnit: 0 }];


export const paymentMethods: PaymentMethod[] = ['M-Pesa', 'Cash', 'Card', 'Bank Transfer'];

const servers = ['Joy Nduta', 'Collins Odhiambo', 'Brenda Akinyi', 'Moses Kibet', 'Sharon Wairimu'];

/** Deterministic pseudo-random generator so demo figures stay stable within a day. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = a + 0x6d2b79f5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const weights = [3, 1, 14, 9, 4, 1, 10, 6, 5, 4, 5, 6, 5, 7, 8, 7, 3, 1];

function pickItem(rand: () => number): CatalogItem {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rand() * total;
  for (let i = 0; i < saleCatalog.length; i++) {
    r -= weights[i];
    if (r <= 0) return saleCatalog[i];
  }
  return saleCatalog[0];
}

function buildDemoSales(): Sale[] {
  const rand = seeded(254745);
  const now = new Date();
  const sales: Sale[] = [];
  let n = 1;
  for (let d = 59; d >= 0; d--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d);
    const weekday = day.getDay();
    const isWeekend = weekday === 5 || weekday === 6;
    const count = Math.floor((isWeekend ? 16 : 9) + rand() * 8);
    for (let i = 0; i < count; i++) {
      const item = pickItem(rand);
      const quantity = item.unitPrice > 5000 ? 1 : 1 + Math.floor(rand() * (item.category === 'Beer' ? 6 : 3));
      const methodRoll = rand();
      const paymentMethod: PaymentMethod =
      methodRoll < 0.55 ? 'M-Pesa' : methodRoll < 0.75 ? 'Card' : methodRoll < 0.93 ? 'Cash' : 'Bank Transfer';
      const when =
      d === 0 ?
      new Date(now.getTime() - Math.floor(rand() * 600) * 60000) :
      new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12 + Math.floor(rand() * 12), Math.floor(rand() * 60));
      sales.push({
        id: `s-${String(n++).padStart(4, '0')}`,
        item: item.name,
        productId: item.productId,
        category: item.category,
        quantity,
        unitPrice: item.unitPrice,
        total: quantity * item.unitPrice,
        paymentMethod,
        date: when.toISOString(),
        servedBy: servers[Math.floor(rand() * servers.length)],
        isDemo: true
      });
    }
  }
  return sales.sort((a, b) => b.date.localeCompare(a.date));
}

export const demoSales: Sale[] = buildDemoSales();