'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';

export default function DebugPage() {
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [parsed, setParsed] = useState<any>(null);
  const { firebaseUser, userProfile } = useUserStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('user-storage');
      setLocalStorageData(data || 'Not found');
      
      if (data) {
        try {
          const p = JSON.parse(data);
          setParsed(p);
        } catch (e) {
          setParsed({ error: 'Failed to parse' });
        }
      }
    }
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-purple-400">
          🔍 Debug Information
        </h1>

        {/* Zustand Store State */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            ✅ Zustand Store (Current State)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">firebaseUser:</h3>
              <pre className="bg-gray-900 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(firebaseUser, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">userProfile:</h3>
              <pre className="bg-gray-900 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* LocalStorage Raw */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            💾 localStorage Raw Data
          </h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto text-xs">
            {localStorageData}
          </pre>
        </div>

        {/* LocalStorage Parsed */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            📝 localStorage Parsed
          </h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </div>

        {/* Demo Mode Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">
            🎯 Demo Mode Status
          </h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">Has firebaseUser in store:</span>
              <span className={firebaseUser ? 'text-green-400' : 'text-red-400'}>
                {firebaseUser ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">Firebase UID:</span>
              <span className="text-blue-400">
                {firebaseUser?.uid || 'Not authenticated'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">Firebase Email:</span>
              <span className="text-blue-400">
                {firebaseUser?.email || 'Not authenticated'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">Has firebaseUser in localStorage:</span>
              <span className={parsed?.state?.firebaseUser ? 'text-green-400' : 'text-red-400'}>
                {parsed?.state?.firebaseUser ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">localStorage uid:</span>
              <span className="text-blue-400">
                {parsed?.state?.firebaseUser?.uid || 'Not found'}
              </span>
            </div>
          </div>
        </div>

        {/* Expected State */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">
            ✨ Expected Firebase Auth State
          </h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto text-xs">
{`{
  "state": {
    "firebaseUser": {
      "uid": "<Firebase UID>",
      "email": "user@example.com",
      "displayName": "Real User"
    },
    "userProfile": {
      "name": "Real User",
      "email": "user@example.com",
      "subscription": {
        "tier": "free",
        "status": "active"
      }
    }
  },
  "version": 0
}`}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={clearStorage}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
          >
            🗑️ Clear localStorage & Reload
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            🚀 Go to Login
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">
            ⚠️ Troubleshooting Steps
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>If "Has firebaseUser in localStorage" is ❌, click "Clear localStorage & Reload"</li>
            <li>After reload, go to /login and click "Start Demo Mode"</li>
            <li>Come back to this page to verify the state</li>
            <li>Check browser Console (F12) for "✅ Demo Mode detected" message</li>
            <li>Check backend terminal for "✅ Demo Mode authentication successful"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
