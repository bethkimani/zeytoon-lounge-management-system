import type { InventoryItem, StockMovement } from '../types/models';
import { daysFromToday } from '../utils/format';

export const demoInventory: InventoryItem[] = [
{ id: 'inv-01', name: 'Johnnie Walker Black Label 750ml', category: 'Spirits', quantity: 18, unit: 'Bottles', purchasePrice: 3800, sellingPrice: 7500, supplier: 'Highland Spirits Ltd (Demo)', threshold: 6, isDemo: true },
{ id: 'inv-02', name: 'Hennessy VS 700ml', category: 'Spirits', quantity: 4, unit: 'Bottles', purchasePrice: 5200, sellingPrice: 10500, supplier: 'Highland Spirits Ltd (Demo)', threshold: 6, isDemo: true },
{ id: 'inv-03', name: 'Tusker Lager 500ml', category: 'Beer', quantity: 96, unit: 'Bottles', purchasePrice: 140, sellingPrice: 350, supplier: 'Rift Valley Beverages (Demo)', threshold: 48, isDemo: true },
{ id: 'inv-04', name: 'Guinness 500ml', category: 'Beer', quantity: 30, unit: 'Bottles', purchasePrice: 160, sellingPrice: 380, supplier: 'Rift Valley Beverages (Demo)', threshold: 36, isDemo: true },
{ id: 'inv-05', name: 'Four Cousins Red 750ml', category: 'Wine', quantity: 22, unit: 'Bottles', purchasePrice: 900, sellingPrice: 2800, supplier: 'Cape Vineyards Imports (Demo)', threshold: 8, isDemo: true },
{ id: 'inv-06', name: 'Moët & Chandon Brut', category: 'Wine', quantity: 6, unit: 'Bottles', purchasePrice: 7500, sellingPrice: 16000, supplier: 'Cape Vineyards Imports (Demo)', threshold: 4, isDemo: true },
{ id: 'inv-07', name: 'Coca-Cola 300ml', category: 'Soft Drinks', quantity: 140, unit: 'Bottles', purchasePrice: 45, sellingPrice: 200, supplier: 'Metro Distributors (Demo)', threshold: 60, isDemo: true },
{ id: 'inv-08', name: 'Red Bull 250ml', category: 'Soft Drinks', quantity: 20, unit: 'Cans', purchasePrice: 180, sellingPrice: 400, supplier: 'Metro Distributors (Demo)', threshold: 24, isDemo: true },
{ id: 'inv-09', name: 'Shisha Flavour — Double Apple', category: 'Shisha', quantity: 3, unit: 'Packs (250g)', purchasePrice: 1200, sellingPrice: 1800, supplier: 'Coastline Shisha Supply (Demo)', threshold: 5, isDemo: true },
{ id: 'inv-10', name: 'Beef Fillet', category: 'Kitchen', quantity: 14, unit: 'Kg', purchasePrice: 1100, sellingPrice: 2600, supplier: 'Karen Prime Butchery (Demo)', threshold: 8, isDemo: true },
{ id: 'inv-11', name: 'Tilapia (whole)', category: 'Kitchen', quantity: 25, unit: 'Pieces', purchasePrice: 450, sellingPrice: 1500, supplier: 'Lake Basin Fish Mongers (Demo)', threshold: 10, isDemo: true },
{ id: 'inv-12', name: 'Fresh Mint', category: 'Kitchen', quantity: 6, unit: 'Bunches', purchasePrice: 50, sellingPrice: 0, supplier: 'City Market Greens (Demo)', threshold: 10, isDemo: true },
{ id: 'inv-13', name: 'Gold Embossed Napkins', category: 'Supplies', quantity: 400, unit: 'Pieces', purchasePrice: 8, sellingPrice: 0, supplier: 'Nairobi Hospitality Supplies (Demo)', threshold: 200, isDemo: true }];


export const inventoryCategories = ['Spirits', 'Wine', 'Beer', 'Soft Drinks', 'Kitchen', 'Shisha', 'Supplies'] as const;

export const demoMovements: StockMovement[] = [
{ id: 'm-01', itemId: 'inv-03', type: 'Received', quantity: 120, date: `${daysFromToday(-6)}T10:15:00`, note: 'Weekly delivery — invoice RV-2231 (demo)', by: 'Halima Yusuf' },
{ id: 'm-02', itemId: 'inv-03', type: 'Issued', quantity: 24, date: `${daysFromToday(-2)}T18:40:00`, note: 'Issued to main bar', by: 'Collins Odhiambo' },
{ id: 'm-03', itemId: 'inv-01', type: 'Received', quantity: 12, date: `${daysFromToday(-5)}T11:00:00`, note: 'Restock — invoice HS-0912 (demo)', by: 'Halima Yusuf' },
{ id: 'm-04', itemId: 'inv-02', type: 'Issued', quantity: 4, date: `${daysFromToday(-1)}T21:10:00`, note: 'VIP bottle service', by: 'Collins Odhiambo' },
{ id: 'm-05', itemId: 'inv-10', type: 'Received', quantity: 20, date: `${daysFromToday(-3)}T08:30:00`, note: 'Morning delivery', by: 'Halima Yusuf' },
{ id: 'm-06', itemId: 'inv-10', type: 'Issued', quantity: 6, date: `${daysFromToday(-1)}T12:00:00`, note: 'Kitchen prep', by: 'Joy Nduta' },
{ id: 'm-07', itemId: 'inv-08', type: 'Issued', quantity: 28, date: `${daysFromToday(-1)}T23:30:00`, note: 'Weekend bar usage', by: 'Collins Odhiambo' },
{ id: 'm-08', itemId: 'inv-09', type: 'Issued', quantity: 5, date: `${daysFromToday(-2)}T22:00:00`, note: 'Shisha lounge', by: 'Joy Nduta' },
{ id: 'm-09', itemId: 'inv-07', type: 'Received', quantity: 96, date: `${daysFromToday(-4)}T09:45:00`, note: 'Metro delivery', by: 'Halima Yusuf' },
{ id: 'm-10', itemId: 'inv-04', type: 'Issued', quantity: 18, date: `${daysFromToday(0)}T13:20:00`, note: 'Issued to main bar', by: 'Collins Odhiambo' }];