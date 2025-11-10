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
  ArrowRightOnRectangleIcon,
  XMarkIcon
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
    <div className={`
      fixed lg:static inset-y-0 left-0 z-50
      transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      transition-transform duration-300 ease-in-out
      flex flex-col w-64 sm:w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 text-white
    `}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
            🚀
          </div>
          <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            GrowPilot
          </h1>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-xl
                transition-all duration-200 group
                animate-slide-in-left
                ${isActive
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse-slow' : ''}`} />
              {item.name}
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-white animate-ping"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* User Info */}
        {firebaseUser && (
          <div className="px-3 py-2.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-xs sm:text-sm font-semibold text-white truncate">{firebaseUser.email}</p>
          </div>
        )}

        {/* Plan Info with Gradient */}
        <div className="px-3 py-2.5 bg-linear-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300">Current Plan</p>
              <p className="text-sm font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Free Tier</p>
            </div>
            <SparklesIcon className="w-5 h-5 text-purple-400 group-hover:animate-pulse" />
          </div>
          <Link 
            href="/settings/subscription"
            onClick={onClose}
            className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-flex items-center space-x-1 font-medium"
          >
            <span>Upgrade</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Logout Button with Animation */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
          {isLoggingOut ? (
            <>
              <span className="spinner spinner-sm mr-2"></span>
              Logging out...
            </>
          ) : (
            'Logout'
          )}
        </button>
      </div>
    </div>
  );
}
