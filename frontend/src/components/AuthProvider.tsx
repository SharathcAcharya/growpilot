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
    // Skip on server-side
    if (typeof window === 'undefined') return;

    // Firebase must be configured to use the app
    if (!auth) {
      console.error('❌ Firebase auth not configured');
      setLoading(false);
      
      // Redirect to login if trying to access protected routes
      const protectedRoutes = ['/dashboard', '/campaigns', '/content', '/seo', '/influencer', '/copilot', '/settings'];
      if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
        router.push('/login');
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user ? `${user.email} (${user.uid})` : 'No user');
      setFirebaseUser(user);
      
      if (user) {
        try {
          // Fetch user profile from backend (creates user if doesn't exist)
          const response = await api.getCurrentUser();
          setUserProfile(response.data.data);
          console.log('✅ User profile loaded:', response.data.data.email);
          
          // Redirect to dashboard if on login/register page
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('❌ Failed to fetch user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
        console.log('⚠️ No authenticated user - redirecting to login');
        
        // Redirect to login if on protected route
        const protectedRoutes = ['/dashboard', '/campaigns', '/content', '/seo', '/influencer', '/copilot', '/settings'];
        if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
          router.push('/login');
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, setFirebaseUser, setUserProfile, setLoading]);

  return <>{children}</>;
}
