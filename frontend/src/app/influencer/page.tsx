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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Influencer Intelligence</h1>
        <p className="text-gray-600 mt-1">Discover and connect with the perfect influencers for your brand</p>
      </div>

      {/* Search Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select
              value={searchParams.platform}
              onChange={(e) => setSearchParams({ ...searchParams, platform: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={searchParams.category}
              onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="fitness">Fitness</option>
              <option value="food">Food & Beverage</option>
              <option value="tech">Technology</option>
              <option value="travel">Travel</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Engagement Rate</label>
            <input
              type="number"
              value={searchParams.minEngagement}
              onChange={(e) => setSearchParams({ ...searchParams, minEngagement: parseFloat(e.target.value) })}
              min="0"
              max="100"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Followers</label>
            <select
              value={searchParams.minFollowers}
              onChange={(e) => setSearchParams({ ...searchParams, minFollowers: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1000">1K+</option>
              <option value="10000">10K+</option>
              <option value="50000">50K+</option>
              <option value="100000">100K+</option>
              <option value="500000">500K+</option>
              <option value="1000000">1M+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Followers</label>
            <select
              value={searchParams.maxFollowers}
              onChange={(e) => setSearchParams({ ...searchParams, maxFollowers: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="50000">50K</option>
              <option value="100000">100K</option>
              <option value="500000">500K</option>
              <option value="1000000">1M</option>
              <option value="5000000">5M</option>
              <option value="10000000">10M+</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={searching}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

      {/* Results Grid */}
      {influencers.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer) => (
            <div
              key={influencer._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Profile Header */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-linear-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {influencer.displayName?.charAt(0) || influencer.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{influencer.displayName || influencer.username}</h3>
                    <p className="text-sm text-gray-500">@{influencer.username}</p>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {influencer.platform}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-bold text-gray-900">{formatNumber(influencer.followers)}</div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-xl font-bold text-gray-900">{influencer.engagementRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Engagement</div>
                  </div>
                </div>

                {/* AI Score */}
                {influencer.aiScore && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">AI Match Score</span>
                      <span className={`text-2xl font-bold ${getScoreColor(influencer.aiScore.overall)}`}>
                        {influencer.aiScore.overall}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full ${getScoreBg(influencer.aiScore.overall)}`}>
                      <div
                        className={`h-2 rounded-full ${influencer.aiScore.overall >= 80 ? 'bg-green-600' : influencer.aiScore.overall >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                        style={{ width: `${influencer.aiScore.overall}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div key="relevance" className="flex justify-between">
                        <span className="text-gray-600">Relevance:</span>
                        <span className="font-semibold">{influencer.aiScore.relevance}</span>
                      </div>
                      <div key="authenticity" className="flex justify-between">
                        <span className="text-gray-600">Authenticity:</span>
                        <span className="font-semibold">{influencer.aiScore.authenticity}</span>
                      </div>
                      <div key="reach" className="flex justify-between">
                        <span className="text-gray-600">Reach:</span>
                        <span className="font-semibold">{influencer.aiScore.reach}</span>
                      </div>
                      <div key="engagement" className="flex justify-between">
                        <span className="text-gray-600">Engagement:</span>
                        <span className="font-semibold">{influencer.aiScore.engagement}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateOutreach(influencer)}
                    className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                  >
                    <SparklesIcon className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <ChatBubbleLeftIcon className="w-6 h-6 mr-2 text-blue-600" />
                AI-Generated Outreach Message
              </h2>
              <button
                onClick={() => setShowOutreach(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-4">
              <textarea
                value={outreachMessage}
                onChange={(e) => setOutreachMessage(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(outreachMessage);
                  alert('Copied to clipboard!');
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Message
              </button>
              <button
                onClick={() => setShowOutreach(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
