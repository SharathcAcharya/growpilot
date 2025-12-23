'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { MagnifyingGlassIcon, UserGroupIcon, SparklesIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

/* --- Influencer types (same as before) --- */
interface Influencer {
  _id: string;
  username: string;
  platform: string;
  displayName: string;
  avatarUrl?: string;
  followers: number;
  engagementRate: number;
  category: string;
  aiScore?: {
    overall: number;
    relevance: number;
    authenticity: number;
    reach: number;
    engagement: number;
  };
}

/* -------------------------
   Improved CustomSelect
   - uses document click listener instead of blur/timeouts
   - places dropdown absolutely with very high z-index
   - dropdown background is crisp (no backdrop-filter)
   - keyboard: Escape to close
   ------------------------- */
function CustomSelect<T extends string | number>({
  label,
  value,
  onChange,
  options,
  id,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; emoji?: string }[];
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!buttonRef.current?.contains(target) && !listRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onDocClick);
      document.addEventListener('keydown', onKey);
    }
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSelect = useCallback(
    (v: T) => {
      onChange(v);
      setOpen(false);
      // return focus to button
      window.setTimeout(() => buttonRef.current?.focus(), 0);
    },
    [onChange]
  );

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative" style={{ overflow: 'visible' }}>
      {label && <label className="block text-sm font-medium text-white mb-2">{label}</label>}

      <button
        id={id}
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="w-full form-field flex items-center justify-between gap-3"
      >
        <span className="flex items-center gap-3 truncate">
          <span className="emoji">{current?.emoji ?? ''}</span>
          <span className="truncate">{current?.label}</span>
        </span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 right-0 mt-2 max-h-56 overflow-auto rounded-lg border border-purple-500/50 shadow-2xl z-9999"
          style={{
            backgroundColor: '#1a1625',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
        >
          {options.map((opt) => (
            <li
              key={String(opt.value)}
              role="option"
              aria-selected={opt.value === value}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(opt.value); }}
              className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${opt.value === value ? 'bg-purple-600/40 text-purple-200' : 'text-gray-100 hover:bg-purple-600/20'}`}
            >
              <span className="emoji-lg">{opt.emoji ?? ''}</span>
              <span className="truncate">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------
   Page (using improved CustomSelect)
   - panel overflow allowed so dropdown can overflow cleanly
   ------------------------- */
export default function InfluencerPage() {
  const [searching, setSearching] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showOutreach, setShowOutreach] = useState(false);
  const [outreachMessage, setOutreachMessage] = useState('');

  const [searchParams, setSearchParams] = useState({
    platform: 'instagram' as string,
    category: 'fashion' as string,
    minFollowers: 10000,
    maxFollowers: 1000000,
    minEngagement: 2,
    username: '',
  });

  const handleSearch = async () => {
    try {
      setSearching(true);
      setInfluencers([]); // Clear previous results
      
      console.log('🔍 Searching for real influencers...', searchParams);
      const response = await api.searchInfluencers(searchParams);
      
      console.log('📦 Full API Response:', response);
      console.log('📦 Response.data:', response.data);
      console.log('📦 Response.data.data:', response.data.data);
      
      const results = response.data.data || [];
      
      console.log(`✅ Found ${results.length} real influencer profiles`);
      console.log('📋 Results array:', results);
      
      setInfluencers(results);
      
      if (results.length === 0) {
        alert('No influencers found. Try different search criteria or enter a specific username.');
      }
    } catch (error: any) {
      console.error('Failed to search influencers:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to search influencers';
      alert(`⚠️ ${errorMessage}\n\nTip: Try entering a specific username for more accurate results.`);
    } finally {
      setSearching(false);
    }
  };

  const handleGenerateOutreach = async (influencer: Influencer) => {
    try {
      const response = await api.generateOutreach(influencer._id, {
        brandInfo: {
          name: 'Your Brand',
          industry: 'Marketing & Technology',
        },
        campaignDetails: {
          name: 'Brand Collaboration',
          objective: 'Increase brand awareness and engagement',
          budgetRange: 'Negotiable',
        },
        // Include influencer data for search results (temp IDs)
        influencerData: {
          username: influencer.username,
          displayName: influencer.displayName,
          platform: influencer.platform,
          profileUrl: `https://${influencer.platform}.com/${influencer.username}`,
          avatarUrl: influencer.avatarUrl,
          bio: `${influencer.category} influencer`,
          category: [influencer.category],
          followers: influencer.followers,
          engagementRate: influencer.engagementRate,
        },
      });
      setOutreachMessage(response.data.data?.message || '');
      setShowOutreach(true);
    } catch (error) {
      console.error('Failed to generate outreach:', error);
      alert('Failed to generate outreach message.');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-300';
    return 'text-red-300';
  };

  const platformOptions = [
    { value: 'instagram', label: 'Instagram', emoji: '📸' },
    { value: 'youtube', label: 'YouTube', emoji: '🎥' },
    { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
    { value: 'twitter', label: 'Twitter', emoji: '🐦' },
  ];
  const categoryOptions = [
    { value: 'fashion', label: 'Fashion', emoji: '👗' },
    { value: 'beauty', label: 'Beauty', emoji: '💄' },
    { value: 'fitness', label: 'Fitness', emoji: '💪' },
    { value: 'food', label: 'Food & Beverage', emoji: '🍔' },
    { value: 'tech', label: 'Technology', emoji: '💻' },
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'lifestyle', label: 'Lifestyle', emoji: '🌟' },
  ];
  const minFollowersOptions = [
    { value: 1000, label: '1K+' },
    { value: 10000, label: '10K+' },
    { value: 50000, label: '50K+' },
    { value: 100000, label: '100K+' },
    { value: 500000, label: '500K+' },
    { value: 1000000, label: '1M+' },
  ];
  const maxFollowersOptions = [
    { value: 50000, label: '50K' },
    { value: 100000, label: '100K' },
    { value: 500000, label: '500K' },
    { value: 1000000, label: '1M' },
    { value: 5000000, label: '5M' },
    { value: 10000000, label: '10M+' },
  ];

  return (
    <div className="hero-bg min-h-screen w-full text-white antialiased" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto p-6 lg:px-12 lg:py-10 space-y-6 sm:space-y-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-ppo">
              <UserGroupIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent gradient-title">
              Influencer Intelligence 🎯
            </h1>
          </div>
          <p className="text-sm sm:text-base text-white/90 ml-0 sm:ml-14">
            Discover and connect with the perfect influencers for your brand
          </p>
        </div>

        {/* Search Panel - panel has overflow visible so the dropdown won't be clipped */}
        <div className="panel glass rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow" style={{ overflow: 'visible' }}>
          <div className="flex items-center space-x-2 mb-4">
            <MagnifyingGlassIcon className="w-5 h-5 text-blue-200" />
            <h2 className="text-lg sm:text-xl font-semibold text-white">Search Criteria</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">🔍 Search Specific Username (Optional)</label>
            <input
              type="text"
              value={searchParams.username}
              onChange={(e) => setSearchParams({ ...searchParams, username: e.target.value })}
              placeholder="e.g., therock, cristiano, kyliejenner"
              className="form-field"
            />
            <p className="text-xs text-white/60 mt-1">
              Leave empty to search by criteria, or enter a username to fetch real profile data
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomSelect
              label="Platform"
              value={searchParams.platform}
              onChange={(v) => setSearchParams({ ...searchParams, platform: String(v) })}
              options={platformOptions}
            />

            <CustomSelect
              label="Category"
              value={searchParams.category}
              onChange={(v) => setSearchParams({ ...searchParams, category: String(v) })}
              options={categoryOptions}
            />

            <div>
              <label className="block text-sm font-medium text-white mb-2">📊 Min Engagement Rate (%)</label>
              <input
                type="number"
                value={searchParams.minEngagement}
                onChange={(e) => setSearchParams({ ...searchParams, minEngagement: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
                step="0.5"
                className="form-field"
              />
            </div>

            <CustomSelect
              label="Min Followers"
              value={searchParams.minFollowers}
              onChange={(v) => setSearchParams({ ...searchParams, minFollowers: Number(v) })}
              options={minFollowersOptions}
            />

            <CustomSelect
              label="Max Followers"
              value={searchParams.maxFollowers}
              onChange={(v) => setSearchParams({ ...searchParams, maxFollowers: Number(v) })}
              options={maxFollowersOptions}
            />

            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                onClick={handleSearch}
                disabled={searching}
                className="btn-primary w-full flex items-center justify-center gap-3"
              >
                {searching ? (
                  <>
                    <div className="spinner" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="w-5 h-5" />
                    <span>Search Influencers</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {influencers.length > 0 && (
          <div className="panel glass rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-5 h-5 text-purple-300" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Found {influencers.length} Influencers
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {influencers.map((influencer) => (
                <div key={influencer._id} className="card glass rounded-xl p-4 hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-3 mb-4">
                    <img
                      src={influencer.avatarUrl || `https://ui-avatars.com/api/?name=${influencer.username}`}
                      alt={influencer.displayName}
                      className="w-14 h-14 rounded-full border-2 border-purple-400/30"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{influencer.displayName}</h3>
                      <p className="text-sm text-white/70 truncate">@{influencer.username}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="chip text-xs">{influencer.platform}</span>
                        <span className="chip text-xs">{influencer.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Followers</span>
                      <span className="text-white font-semibold">{formatNumber(influencer.followers)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Engagement</span>
                      <span className="text-white font-semibold">{influencer.engagementRate.toFixed(2)}%</span>
                    </div>
                    {influencer.aiScore && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">AI Score</span>
                        <span className={`font-bold ${getScoreColor(influencer.aiScore.overall)}`}>
                          {influencer.aiScore.overall}/100
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleGenerateOutreach(influencer)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span>Generate Outreach</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {/* {!searching && influencers.length === 0 && (
          <div className="panel glass rounded-xl p-8 sm:p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-4">
              <UserGroupIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Find Your Perfect Influencers</h3>
            <p className="text-white/70 mb-4">
              Use the search criteria above to discover influencers that match your brand
            </p>
            <p className="text-sm text-white/60">
              🎯 Filter by platform, category, followers, and engagement rate
            </p>
          </div>
        )} */}

        {/* Outreach Message Modal */}
        {showOutreach && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="panel glass rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Generated Outreach Message</h3>
                <button
                  onClick={() => setShowOutreach(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-white/90 bg-white/5 p-4 rounded-lg border border-white/10">
                  {outreachMessage}
                </pre>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => navigator.clipboard.writeText(outreachMessage)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowOutreach(false)}
                  className="flex-1 px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Styles --- */}
      <style jsx global>{`
        :root {
          --hero-left: #0b1220;
          --hero-right: #4b0f66;
          --accent1: #7c3aed;
          --accent2: #2563eb;
        }
        .hero-bg {
          min-height: 100vh;
          position: relative;
          background-image:
            radial-gradient(38% 34% at 22% 32%, rgba(24,58,138,0.40) 0%, rgba(24,58,138,0.04) 25%, transparent 50%),
            radial-gradient(30% 28% at 76% 24%, rgba(185,58,166,0.36) 0%, rgba(185,58,166,0.04) 25%, transparent 50%),
            linear-gradient(180deg, rgba(11,18,32,1) 0%, rgba(75,15,102,0.98) 40%, rgba(75,15,102,0.96) 100%);
          background-repeat: no-repeat;
          background-size: cover, cover, cover;
          color: #fff;
          -webkit-font-smoothing: antialiased;
        }

        .form-field {
          width: 100%;
          padding: 0.625rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
          outline: none;
          transition: box-shadow .18s, transform .12s;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
        }
        .form-field:focus {
          box-shadow: 0 6px 30px rgba(37,99,235,0.12);
          border-color: rgba(99,102,241,0.6);
        }
        .form-field::placeholder { color: rgba(255,255,255,0.55); }

        .panel, .card, .glass {
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
          backdrop-filter: blur(6px) saturate(120%);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          padding: .625rem 1rem;
          border-radius: .75rem;
          background: linear-gradient(90deg, var(--accent1), var(--accent2));
          color: #fff;
          font-weight: 600;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(37,99,235,0.12);
          transition: transform .18s, box-shadow .18s;
        }
        .btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .btn-primary:hover { transform: translateY(-2px); }

        .spinner {
          width:1.125rem; height:1.125rem;
          border-radius:50%;
          border:2px solid rgba(255,255,255,0.18);
          border-bottom-color:#fff;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .gradient-title {
          background-image: linear-gradient(90deg, #b3d6ff 0%, #e8c6ff 40%, #ffb3c5 100%);
        }
        .bg-gradient-ppo { background: linear-gradient(90deg, var(--accent1), var(--accent2)); }
        .gradient-ppo { -webkit-background-clip: text; background-clip: text; color: transparent; }

        .emoji { font-size: 1.05rem; line-height: 1; display:inline-block; }
        .emoji-lg { font-size: 1.2rem; width:1.5rem; text-align:center; }
        .chip { padding:.375rem .75rem; border-radius: .75rem; background: rgba(255,255,255,0.03); color:#fff; border: 1px solid rgba(255,255,255,0.04); }

        /* ensure dropdown is crisp and not affected by parent's backdrop-filter */
        ul[role="listbox"] {
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
        }

        /* small improvements for emoji readability */
        .emoji, .emoji-lg, .card svg, .panel svg {
          text-shadow: 0 2px 10px rgba(2,6,23,0.65);
        }
      `}</style>
    </div>
  );
}
