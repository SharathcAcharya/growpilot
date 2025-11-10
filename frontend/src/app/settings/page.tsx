'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Toast from '@/components/Toast';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  KeyIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const router = useRouter();
  const { firebaseUser, loading: authLoading } = useUserStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  const handleSave = () => {
    setToastMessage('✅ Settings saved successfully!');
    setShowToast(true);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
    { id: 'api', label: 'API Keys', icon: KeyIcon },
  ];

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-900 via-purple-900 to-black">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-slide-in-down">
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass p-4 rounded-xl space-y-2 animate-fade-in">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="glass p-8 rounded-xl animate-slide-in-up">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Profile Information</h2>
                    <p className="text-gray-400 mb-6">Update your personal details</p>
                  </div>

                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-linear-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {firebaseUser?.displayName?.charAt(0)?.toUpperCase() || 'D'}
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all mb-2">
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-400">JPG, PNG or GIF (max. 2MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Display Name</label>
                      <input
                        type="text"
                        defaultValue={firebaseUser?.displayName || 'Demo User'}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={firebaseUser?.email || 'demo@growpilot.com'}
                        disabled
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Bio</label>
                    <textarea
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Notification Preferences</h2>
                    <p className="text-gray-400 mb-6">Choose how you want to be notified</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium mb-1">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          emailNotifications ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            emailNotifications ? 'translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium mb-1">Push Notifications</h3>
                        <p className="text-sm text-gray-400">Get notified on your device</p>
                      </div>
                      <button
                        onClick={() => setPushNotifications(!pushNotifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          pushNotifications ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            pushNotifications ? 'translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium mb-1">Campaign Updates</h3>
                        <p className="text-sm text-gray-400">Notifications about campaign performance</p>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-purple-600">
                        <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium mb-1">Weekly Reports</h3>
                        <p className="text-sm text-gray-400">Receive weekly performance summaries</p>
                      </div>
                      <button className="relative w-12 h-6 rounded-full bg-purple-600">
                        <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-6" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    Save Preferences
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Security Settings</h2>
                    <p className="text-gray-400 mb-6">Manage your account security</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-300">
                      🔒 Your account is in Demo Mode. Full security features will be available after creating an account.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Password</h3>
                      <p className="text-sm text-gray-400 mb-4">Last changed: Never</p>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                        Change Password
                      </button>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400 mb-4">Add an extra layer of security</p>
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Active Sessions</h3>
                      <p className="text-sm text-gray-400 mb-4">Manage devices that are logged in</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                        Sign Out All Devices
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Billing & Subscription</h2>
                    <p className="text-gray-400 mb-6">Manage your subscription and payment methods</p>
                  </div>

                  <div className="bg-linear-to-r from-purple-600 to-blue-600 p-6 rounded-xl text-white mb-6">
                    <h3 className="text-2xl font-bold mb-2">Demo Mode</h3>
                    <p className="mb-4">You're currently using all features for free!</p>
                    <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-all">
                      Upgrade to Pro
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { name: 'Free', price: '$0', features: ['5 Campaigns', 'Basic Analytics', 'Email Support'] },
                        { name: 'Pro', price: '$49', features: ['Unlimited Campaigns', 'Advanced Analytics', 'Priority Support', 'AI Copilot'] },
                        { name: 'Business', price: '$99', features: ['Everything in Pro', 'White Label', 'API Access', 'Dedicated Account Manager'] },
                      ].map((plan) => (
                        <div key={plan.name} className="p-6 bg-gray-800 rounded-xl">
                          <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                          <p className="text-3xl font-bold gradient-text mb-4">{plan.price}<span className="text-sm text-gray-400">/mo</span></p>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature) => (
                              <li key={feature} className="text-sm text-gray-400 flex items-center">
                                <span className="text-green-400 mr-2">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all">
                            Select Plan
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* API Keys Tab */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">API Keys</h2>
                    <p className="text-gray-400 mb-6">Manage your API keys for integrations</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-300">
                      🔑 API access is available on Pro and Business plans
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">Production API Key</h3>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Active</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="flex-1 px-3 py-2 bg-gray-900 text-gray-400 rounded text-sm font-mono">
                          sk_live_••••••••••••••••••••
                        </code>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all">
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Created: Nov 1, 2024 • Last used: 2 hours ago</p>
                    </div>

                    <button className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
                      Generate New Key
                    </button>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-300">
                      ⚠️ Never share your API keys publicly. Keep them secure.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
