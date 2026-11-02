import React from 'react';

export function PageSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="mb-2 h-9 w-56 rounded bg-raised" />
      <div className="mb-8 h-4 w-80 rounded bg-raised/70" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-40 rounded-2xl bg-raised md:col-span-2" />
        <div className="h-40 rounded-2xl bg-raised" />
      </div>
      <div className="mt-4 h-72 rounded-2xl bg-raised" />
    </div>);

}