'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { 
  HomeIcon, 
  MegaphoneIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Campaigns', href: '/campaigns', icon: MegaphoneIcon },
  { name: 'Content', href: '/content', icon: DocumentTextIcon },
  { name: 'SEO', href: '/seo', icon: ChartBarIcon },
  { name: 'Influencers', href: '/influencer', icon: UserGroupIcon },
  { name: 'AI Copilot', href: '/copilot', icon: SparklesIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, logout } = useUserStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      if (auth) {
        await signOut(auth);
      }
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col w-64 bg-gray-900 text-white">
      <div className="flex items-center justify-center h-16 bg-gray-800">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          🚀 GrowPilot
        </h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg
                transition-colors duration-200
                ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3">
        {/* User Info */}
        {firebaseUser && (
          <div className="px-4 py-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{firebaseUser.email}</p>
          </div>
        )}

        {/* Plan Info */}
        <div className="px-4 py-3 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400">Current Plan</p>
          <p className="text-sm font-semibold text-white">Free Tier</p>
          <Link 
            href="/settings/subscription"
            className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block"
          >
            Upgrade →
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
