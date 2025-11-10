'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { MagnifyingGlassIcon, UserGroupIcon, SparklesIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

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

export default function InfluencerPage() {
  const [searching, setSearching] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showOutreach, setShowOutreach] = useState(false);
  const [outreachMessage, setOutreachMessage] = useState('');

  const [searchParams, setSearchParams] = useState({
    platform: 'instagram',
    category: 'fashion',
    minFollowers: 10000,
    maxFollowers: 1000000,
    minEngagement: 2,
  });

  const handleSearch = async () => {
    try {
      setSearching(true);
      const response = await api.searchInfluencers(searchParams);
      setInfluencers(response.data.data || []);
    } catch (error) {
      console.error('Failed to search influencers:', error);
      alert('Failed to search influencers. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleGenerateOutreach = async (influencer: Influencer) => {
    try {
      const response = await api.generateOutreach(influencer._id, {
        campaignType: 'sponsored_post',
        brandName: 'Your Brand',
        campaignDetails: 'Product launch collaboration',
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
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="animate-slide-in-down">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-xl bg-linear-to-r from-pink-500 to-purple-600">
            <UserGroupIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Influencer Intelligence 🎯
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-200 ml-0 sm:ml-14">Discover and connect with the perfect influencers for your brand</p>
      </div>

      {/* Search Panel */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-400/50 transition-all animate-slide-in-up">
        <div className="flex items-center space-x-2 mb-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg sm:text-xl font-semibold text-white">Search Criteria</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">📱 Platform</label>
            <select
              value={searchParams.platform}
              onChange={(e) => setSearchParams({ ...searchParams, platform: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
            >
              <option value="instagram" className="bg-gray-900">📸 Instagram</option>
              <option value="youtube" className="bg-gray-900">🎥 YouTube</option>
              <option value="tiktok" className="bg-gray-900">🎵 TikTok</option>
              <option value="twitter" className="bg-gray-900">🐦 Twitter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">🏷️ Category</label>
            <select
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
            >
              <option value="fashion" className="bg-gray-900">👗 Fashion</option>
              <option value="beauty" className="bg-gray-900">💄 Beauty</option>
              <option value="fitness" className="bg-gray-900">💪 Fitness</option>
              <option value="food" className="bg-gray-900">🍔 Food & Beverage</option>
              <option value="tech" className="bg-gray-900">💻 Technology</option>
              <option value="travel" className="bg-gray-900">✈️ Travel</option>
              <option value="lifestyle" className="bg-gray-900">🌟 Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">📊 Min Engagement Rate (%)</label>
            <input
              type="number"
              value={searchParams.minEngagement}
              onChange={(e) => setSearchParams({ ...searchParams, minEngagement: parseFloat(e.target.value) })}
              min="0"
              max="100"
              step="0.5"
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">👥 Min Followers</label>
            <select
              value={searchParams.minFollowers}
              onChange={(e) => setSearchParams({ ...searchParams, minFollowers: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
            >
              <option value="1000" className="bg-gray-900">1K+</option>
              <option value="10000" className="bg-gray-900">10K+</option>
              <option value="50000" className="bg-gray-900">50K+</option>
              <option value="100000" className="bg-gray-900">100K+</option>
              <option value="500000" className="bg-gray-900">500K+</option>
              <option value="1000000" className="bg-gray-900">1M+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">⬆️ Max Followers</label>
            <select
              value={searchParams.maxFollowers}
              onChange={(e) => setSearchParams({ ...searchParams, maxFollowers: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
            >
              <option value="50000" className="bg-gray-900">50K</option>
              <option value="100000" className="bg-gray-900">100K</option>
              <option value="500000" className="bg-gray-900">500K</option>
              <option value="1000000" className="bg-gray-900">1M</option>
              <option value="5000000" className="bg-gray-900">5M</option>
              <option value="10000000" className="bg-gray-900">10M+</option>
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              onClick={handleSearch}
              disabled={searching}
              className="w-full px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 group"
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Search Influencers</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!searching && influencers.length === 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 sm:p-12 text-center hover:border-purple-400/30 transition-colors">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Ready to Find Your Perfect Influencers? 🎯
            </h3>
            <p className="text-white mb-6">
              Use the search filters above to discover influencers that match your brand. Our AI will analyze and score each match for you!
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">✨ AI-Powered Scoring</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">📊 Detailed Analytics</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">💬 Auto Outreach</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {influencers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {influencers.map((influencer, index) => (
            <div
              key={influencer._id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-purple-400/50 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Profile Header */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {influencer.displayName?.charAt(0) || influencer.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">{influencer.displayName || influencer.username}</h3>
                    <p className="text-xs sm:text-sm text-gray-200 truncate">@{influencer.username}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg border border-blue-400/30">
                      📱 {influencer.platform}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                  <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                    <div className="text-lg sm:text-xl font-bold text-white">{formatNumber(influencer.followers)}</div>
                    <div className="text-xs text-gray-200">👥 Followers</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/15 transition-colors">
                    <div className="text-lg sm:text-xl font-bold text-white">{influencer.engagementRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-200">📊 Engagement</div>
                  </div>
                </div>

                {/* AI Score */}
                {influencer.aiScore && (
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-medium text-white">🤖 AI Match Score</span>
                      <span className={`text-xl sm:text-2xl font-bold ${getScoreColor(influencer.aiScore.overall)}`}>
                        {influencer.aiScore.overall}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${influencer.aiScore.overall >= 80 ? 'bg-linear-to-r from-green-500 to-emerald-400' : influencer.aiScore.overall >= 60 ? 'bg-linear-to-r from-yellow-500 to-orange-400' : 'bg-linear-to-r from-red-500 to-pink-400'}`}
                        style={{ width: `${influencer.aiScore.overall}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div key={`${influencer._id}-relevance`} className="flex justify-between items-center">
                        <span className="text-gray-200">✨ Relevance:</span>
                        <span className="font-semibold text-white">{influencer.aiScore.relevance}</span>
                      </div>
                      <div key={`${influencer._id}-authenticity`} className="flex justify-between items-center">
                        <span className="text-gray-200">✅ Authenticity:</span>
                        <span className="font-semibold text-white">{influencer.aiScore.authenticity}</span>
                      </div>
                      <div key={`${influencer._id}-reach`} className="flex justify-between items-center">
                        <span className="text-gray-200">🌐 Reach:</span>
                        <span className="font-semibold text-white">{influencer.aiScore.reach}</span>
                      </div>
                      <div key={`${influencer._id}-engagement`} className="flex justify-between items-center">
                        <span className="text-gray-200">💬 Engagement:</span>
                        <span className="font-semibold text-white">{influencer.aiScore.engagement}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateOutreach(influencer)}
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2 text-sm font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 group"
                  >
                    <SparklesIcon className="w-4 h-4 group-hover:animate-pulse" />
                    <span>Generate Outreach</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outreach Modal */}
      {showOutreach && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl shadow-purple-500/20 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <div className="p-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 mr-3">
                  <ChatBubbleLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  AI-Generated Outreach Message ✨
                </span>
              </h2>
              <button
                onClick={() => setShowOutreach(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6 hover:border-purple-400/50 transition-colors">
              <textarea
                value={outreachMessage}
                onChange={(e) => setOutreachMessage(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all hover:bg-white/15"
                placeholder="Your AI-generated message will appear here..."
              />
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(outreachMessage);
                  alert('Copied to clipboard! 📋');
                }}
                className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center space-x-2 group"
              >
                <span>📋</span>
                <span>Copy Message</span>
              </button>
              <button
                onClick={() => setShowOutreach(false)}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 hover:border-purple-400/50 transition-all font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

