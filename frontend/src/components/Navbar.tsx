'use client';

import { Menu } from '@headlessui/react';
import { BellIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { userProfile, logout } = useUserStore();

  const handleLogout = async () => {
    try {
      if (!auth) {
        console.warn('Auth not initialized');
        logout();
        router.push('/login');
        return;
      }
      await signOut(auth);
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Title */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">
              Welcome back, <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{userProfile?.displayName || 'User'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 hidden sm:block">
              Here's what's happening with your marketing today
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-all group">
            <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 focus:outline-none p-1.5 rounded-full hover:bg-white/10 transition-all">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-500 hover:border-blue-400 transition-colors"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white/20">
                  {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 sm:w-56 bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl py-2 border border-white/20 focus:outline-none z-50 animate-scale-in">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/settings"
                    className={`block px-4 py-2.5 text-sm text-white transition-colors ${
                      active ? 'bg-white/10' : ''
                    }`}
                  >
                    ⚙️ Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/settings/subscription"
                    className={`block px-4 py-2.5 text-sm text-white transition-colors ${
                      active ? 'bg-white/10' : ''
                    }`}
                  >
                    💎 Subscription
                  </a>
                )}
              </Menu.Item>
              <div className="border-t border-white/10 my-1"></div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2.5 text-sm text-red-400 transition-colors ${
                      active ? 'bg-red-500/10' : ''
                    }`}
                  >
                    🚪 Sign Out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
