import type { MenuItem } from '../types/models';
import { images } from './images';

export const menuCategories = ['Starters', 'Mains', 'Grill', 'Cocktails', 'Wines & Spirits', 'Shisha'] as const;

export const menuItems: MenuItem[] = [
{ id: 'mi-01', name: 'Zeytoon Mezze Board', description: 'Hummus, baba ghanoush, olives, warm pita and house pickles.', price: 1800, category: 'Starters', image: null, featured: false },
{ id: 'mi-02', name: 'Spiced Chicken Wings', description: 'Pilipili glaze, lime and spring onion.', price: 1200, category: 'Starters', image: null, featured: false },
{ id: 'mi-03', name: 'Coconut Prawn Samosas', description: 'Coast-style prawns, coconut chutney.', price: 1400, category: 'Starters', image: null, featured: false },
{ id: 'mi-04', name: 'Grilled Whole Tilapia', description: 'Lake Victoria tilapia, lemon-herb butter, coconut rice.', price: 1500, category: 'Mains', image: images.seafood, featured: true },
{ id: 'mi-05', name: 'Swahili Chicken Curry', description: 'Slow-cooked in coconut and spices, served with pilau.', price: 1600, category: 'Mains', image: null, featured: false },
{ id: 'mi-06', name: 'Wild Mushroom Risotto', description: 'Arborio rice, parmesan, truffle oil.', price: 1700, category: 'Mains', image: null, featured: false },
{ id: 'mi-07', name: 'Nyama Choma Platter', description: 'Goat and beef ribs, kachumbari, ugali and grilled bananas. Serves two.', price: 3200, category: 'Grill', image: images.nyama, featured: true },
{ id: 'mi-08', name: 'Beef Fillet Steak', description: '250g fillet, peppercorn sauce, hand-cut fries.', price: 2600, category: 'Grill', image: images.chef, featured: true },
{ id: 'mi-09', name: 'Lamb Chops', description: 'Rosemary and garlic, minted yoghurt.', price: 2900, category: 'Grill', image: null, featured: false },
{ id: 'mi-10', name: 'Zeytoon Gold', description: 'Our signature: aged rum, passion fruit, honey and edible gold leaf.', price: 950, category: 'Cocktails', image: images.cocktail, featured: true },
{ id: 'mi-11', name: 'Dawa Royale', description: 'Vodka, lime, honey, topped with prosecco.', price: 900, category: 'Cocktails', image: null, featured: false },
{ id: 'mi-12', name: 'Classic Mojito', description: 'White rum, fresh mint, lime, soda.', price: 850, category: 'Cocktails', image: null, featured: false },
{ id: 'mi-13', name: 'Moët & Chandon Brut', description: 'Bottle, served on ice.', price: 16000, category: 'Wines & Spirits', image: null, featured: false },
{ id: 'mi-14', name: 'Johnnie Walker Black Label', description: 'Bottle service with mixers.', price: 7500, category: 'Wines & Spirits', image: null, featured: false },
{ id: 'mi-15', name: 'Four Cousins Red', description: 'Bottle. Sweet, fruity and easy drinking.', price: 2800, category: 'Wines & Spirits', image: null, featured: false },
{ id: 'mi-16', name: 'Signature Shisha', description: 'Double apple, mint or grape. Refreshed coals all night.', price: 1800, category: 'Shisha', image: null, featured: false }];