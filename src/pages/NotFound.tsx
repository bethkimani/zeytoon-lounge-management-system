import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-night px-6 text-center">
      <p className="font-display text-7xl font-semibold text-gold">404</p>
      <h1 className="mt-4 font-display text-3xl">This page has left the lounge</h1>
      <p className="mt-2 text-sm text-muted">The page you’re looking for doesn’t exist.</p>
      <div className="mt-6 flex gap-4 text-sm">
        <Link to="/" className="text-gold hover:text-gold-soft">Website home</Link>
        <Link to="/admin" className="text-muted hover:text-fg">Dashboard</Link>
      </div>
    </div>);

}