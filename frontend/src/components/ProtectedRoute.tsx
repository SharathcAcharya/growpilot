'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/login' }: ProtectedRouteProps) {
  const router = useRouter();
  const { firebaseUser, loading } = useUserStore();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push(redirectTo);
    }
  }, [firebaseUser, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return <>{children}</>;
}
