'use client';

import { Menu } from '@headlessui/react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useUserStore } from '@/store/userStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const { userProfile, logout } = useUserStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back, {userProfile?.displayName || 'User'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your marketing today
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <BellIcon className="w-6 h-6" />
          </button>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-2 focus:outline-none">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 text-gray-400" />
              )}
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 focus:outline-none z-10">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/settings"
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/settings/subscription"
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Subscription
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${
                      active ? 'bg-gray-100' : ''
                    }`}
                  >
                    Sign Out
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
