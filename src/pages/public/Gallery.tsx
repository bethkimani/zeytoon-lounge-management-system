import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { galleryImages } from '../../data/gallery';
import { images } from '../../data/images';
import { cn } from '../../utils/cn';
import { PageHero } from '../../components/public/PageHero';

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d: number) => setIndex((i) => i === null ? i : (i + d + galleryImages.length) % galleryImages.length), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, close, step]);

  return (
    <>
      <PageHero title="Gallery" subtitle="A look inside the lounge, the kitchen and our nights." image={images.bar} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4">
          {galleryImages.map((g, i) =>
          <button
            key={g.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open image: ${g.alt}`}
            className={cn(
              'overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              g.span === 'wide' && 'col-span-2',
              g.span === 'tall' && 'row-span-2'
            )}>
            
              <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]" />
            </button>
          )}
        </div>
      </section>

      <AnimatePresence>
        {index !== null &&
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={galleryImages[index].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/95 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}>
          
            <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-fg hover:text-gold"><XIcon className="h-6 w-6" /></button>
            <button type="button" onClick={(e) => {e.stopPropagation();step(-1);}} aria-label="Previous image" className="absolute left-2 rounded-full p-3 text-fg hover:text-gold md:left-6"><ChevronLeftIcon className="h-8 w-8" /></button>
            <figure onClick={(e) => e.stopPropagation()} className="max-w-5xl">
              <img src={galleryImages[index].src} alt={galleryImages[index].alt} className="max-h-[80vh] w-auto rounded-xl object-contain" />
              <figcaption className="mt-3 text-center text-sm text-muted">{galleryImages[index].alt}</figcaption>
            </figure>
            <button type="button" onClick={(e) => {e.stopPropagation();step(1);}} aria-label="Next image" className="absolute right-2 rounded-full p-3 text-fg hover:text-gold md:right-6"><ChevronRightIcon className="h-8 w-8" /></button>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}