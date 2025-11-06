import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';

interface Brand {
  name: string;
  industry: string;
  website?: string;
  logo?: string;
}

interface Subscription {
  tier: 'free' | 'pro' | 'business';
  status: string;
  currentPeriodEnd?: Date;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  subscription: Subscription;
  brands: Brand[];
  usage: {
    campaignsCreated: number;
    campaignsThisMonth: number;
    contentGenerated: number;
    seoAudits: number;
  };
}

interface UserStore {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      firebaseUser: null,
      userProfile: null,
      loading: true,

      setFirebaseUser: (user) => set({ firebaseUser: user }),
      
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      setLoading: (loading) => set({ loading }),
      
      logout: () => set({ firebaseUser: null, userProfile: null }),
    }),
    {
      name: 'user-storage',
      // Only persist serializable data - don't persist firebaseUser (causes hydration issues)
      partialize: (state) => ({ 
        userProfile: state.userProfile 
      }),
    }
  )
);
