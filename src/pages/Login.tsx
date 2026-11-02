import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Field, inputClass } from '../components/ui/Field';
import { demoUsers } from '../data/users';
import { images } from '../data/images';

export function Login() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as {from?: string;} | null)?.from ?? '/admin';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (ready && user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    const err = await login(email, password);
    setLoading(false);
    if (err) setError(err);else
    navigate(from.startsWith('/admin') ? from : '/admin', { replace: true });
  };

  return (
    <div className="grid min-h-screen w-full bg-night lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={images.hero} alt="Zeytoon Lounge interior" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-night/50" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-display text-5xl font-semibold leading-tight text-fg">
            Every table, every pour,
            <br />
            every night — in one place.
          </p>
          <p className="mt-4 max-w-md text-sm text-fg/80">Zeytoon Lounge Management System · USIU Road, Nairobi</p>
        </div>
      </div>

      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" className="inline-flex items-center gap-2 self-start text-sm text-muted hover:text-gold">
          <ArrowLeftIcon className="h-4 w-4" /> Back to website
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 font-display text-2xl font-semibold text-gold">
            Z
          </div>
          <h1 className="font-display text-4xl font-semibold">Staff sign in</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage reservations, tables, stock and sales.</p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            {error &&
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger">
                <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            }
            <Field label="Email" htmlFor="email">
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@zeytoon.demo" />
            </Field>
            <Field label="Password" htmlFor="password">
              <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
            </Field>
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <div className="mt-10 border-t border-edge pt-6">
            <p className="text-xs font-medium text-muted">Demo accounts — password <span className="text-fg">demo1234</span></p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {demoUsers.map((u) =>
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setEmail(u.email);
                  setPassword(u.password);
                  setError(null);
                }}
                className="rounded-lg border border-edge px-3 py-2 text-left transition-colors hover:border-gold/40">
                
                  <span className="block text-sm text-fg">{u.role}</span>
                  <span className="block truncate text-xs text-subtle">{u.email}</span>
                </button>
              )}
            </div>
            <p className="mt-4 text-xs text-subtle">
              Prototype authentication for demonstration only. Production would use Supabase Auth.
            </p>
          </div>
        </div>
      </div>
    </div>);

}