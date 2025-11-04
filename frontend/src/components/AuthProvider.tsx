'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/store/userStore';
import { api } from '@/lib/api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setFirebaseUser, setUserProfile, setLoading } = useUserStore();

  useEffect(() => {
    // Skip auth if Firebase is not configured
    if (!auth) {
      console.warn('⚠️ Firebase auth not configured - running in demo mode');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          // Fetch user profile from backend
          const response = await api.getCurrentUser();
          setUserProfile(response.data.data);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      } else {
        setUserProfile(null);
        // Redirect to login if on protected route
        if (window.location.pathname.startsWith('/dashboard') || 
            window.location.pathname.startsWith('/campaigns') ||
            window.location.pathname.startsWith('/content')) {
          router.push('/login');
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, setFirebaseUser, setUserProfile, setLoading]);

  return <>{children}</>;
}
