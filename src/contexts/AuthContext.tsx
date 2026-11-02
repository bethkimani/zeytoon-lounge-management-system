import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppUser, Role } from '../types/models';
import { demoUsers } from '../data/users';
import { uid } from '../utils/format';

const USERS_KEY = 'zeytoon-demo-users-v1';
const SESSION_KEY = 'zeytoon-demo-session-v1';

interface NewUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface AuthContextValue {
  user: AppUser | null;
  users: AppUser[];
  ready: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  addUser: (input: NewUserInput) => string | null;
  updateUserRole: (id: string, role: Role) => void;
  removeUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) as AppUser[] : demoUsers;
  } catch {
    return demoUsers;
  }
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [users, setUsers] = useState<AppUser[]>(loadUsers);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setSessionId(localStorage.getItem(SESSION_KEY));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {

      /* storage unavailable — keep in memory */}
  }, [users]);

  const user = useMemo(() => users.find((u) => u.id === sessionId) ?? null, [users, sessionId]);

  const login = useCallback(
    async (email: string, password: string) => {
      await new Promise((r) => setTimeout(r, 500));
      const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!match || match.password !== password) return 'Incorrect email or password.';
      setSessionId(match.id);
      localStorage.setItem(SESSION_KEY, match.id);
      return null;
    },
    [users]
  );

  const logout = useCallback(() => {
    setSessionId(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const addUser = useCallback(
    (input: NewUserInput) => {
      if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase()))
      return 'A user with this email already exists.';
      setUsers((prev) => [...prev, { ...input, id: uid('u'), isDemo: false }]);
      return null;
    },
    [users]
  );

  const updateUserRole = useCallback((id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const value = useMemo(
    () => ({ user, users, ready, login, logout, addUser, updateUserRole, removeUser }),
    [user, users, ready, login, logout, addUser, updateUserRole, removeUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}