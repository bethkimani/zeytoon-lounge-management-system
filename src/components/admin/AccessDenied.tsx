import React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_DESCRIPTIONS } from '../../utils/permissions';

export function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold">
        <LockIcon className="h-6 w-6" />
      </div>
      <h1 className="font-display text-3xl font-semibold">This area is restricted</h1>
      <p className="mt-2 text-sm text-muted">
        You’re signed in as <span className="text-fg">{user?.role}</span>. {user && ROLE_DESCRIPTIONS[user.role]} Ask an
        administrator if you need access.
      </p>
      <Link to="/admin" className="mt-6 text-sm font-medium text-gold hover:text-gold-soft">
        Back to dashboard
      </Link>
    </div>);

}