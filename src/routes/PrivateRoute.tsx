// src/routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export default function PrivateRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
