import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
}

export function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative flex h-[46vh] min-h-[320px] items-end overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-night/65" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-night/60" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 md:px-8">
        <h1 className="font-display text-5xl font-semibold text-fg md:text-7xl">{title}</h1>
        <p className="mt-3 max-w-xl text-base text-fg/80">{subtitle}</p>
      </div>
    </section>);

}