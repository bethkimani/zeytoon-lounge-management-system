import React, { useState } from 'react';
import type { MenuCategory } from '../../types/models';
import { images } from '../../data/images';
import { menuCategories, menuItems } from '../../data/menu';
import { formatKES } from '../../utils/format';
import { cn } from '../../utils/cn';
import { PageHero } from '../../components/public/PageHero';

export function Menu() {
  const [category, setCategory] = useState<MenuCategory>('Grill');
  const items = menuItems.filter((m) => m.category === category);
  const feature = items.find((i) => i.image);

  return (
    <>
      <PageHero title="The Menu" subtitle="Coastal, Middle Eastern and Kenyan grill — with a bar to match." image={images.nyama} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div role="tablist" aria-label="Menu categories" className="flex gap-2 overflow-x-auto border-b border-edge pb-px">
          {menuCategories.map((c) =>
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={c === category}
            onClick={() => setCategory(c)}
            className={cn(
              '-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors duration-150',
              c === category ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-fg'
            )}>
            
              {c}
            </button>
          )}
        </div>

        <div className={cn('mt-10 grid gap-12', feature && 'lg:grid-cols-[1fr_380px]')}>
          <ul role="tabpanel" className="divide-y divide-edge">
            {items.map((item) =>
            <li key={item.id} className="flex items-baseline gap-4 py-5">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-2xl font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
                <span aria-hidden="true" className="hidden flex-1 border-b border-dotted border-edge sm:block" />
                <span className="shrink-0 tabular-nums text-gold">{formatKES(item.price)}</span>
              </li>
            )}
          </ul>
          {feature &&
          <figure className="hidden lg:block">
              <img src={feature.image!} alt={feature.name} className="aspect-[4/5] w-full rounded-2xl object-cover" />
              <figcaption className="mt-3 text-sm text-muted">{feature.name}</figcaption>
            </figure>
          }
        </div>
        <p className="mt-12 text-xs text-subtle">Prices in KES, inclusive of VAT. Menu and prices are sample content for this demonstration. Please tell your server about any allergies.</p>
      </section>
    </>);

}