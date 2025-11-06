'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import { useCampaignStore } from '@/store/campaignStore';
import CampaignCard from '@/components/CampaignCard';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function CampaignsPage() {
  const router = useRouter();
  const { firebaseUser, loading: authLoading } = useUserStore();
  const { campaigns, setCampaigns } = useCampaignStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
      return;
    }

    if (firebaseUser) {
      fetchCampaigns();
    }
  }, [firebaseUser, authLoading, router]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.getCampaigns();
      setCampaigns(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = filter === 'all' || campaign.status === filter;
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    paused: campaigns.filter(c => c.status === 'paused').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-900 via-purple-900 to-black">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-400">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in-down">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Campaigns</h1>
          <p className="text-gray-400">Manage and monitor your marketing campaigns</p>
        </div>
        <button
          onClick={() => router.push('/campaigns/create')}
          className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
        {[
          { label: 'Total Campaigns', value: stats.total, color: 'from-blue-500 to-cyan-500' },
          { label: 'Active', value: stats.active, color: 'from-green-500 to-emerald-500' },
          { label: 'Paused', value: stats.paused, color: 'from-orange-500 to-yellow-500' },
          { label: 'Draft', value: stats.draft, color: 'from-gray-500 to-gray-600' },
        ].map((stat, index) => (
          <div 
            key={stat.label}
            className="glass p-6 rounded-xl card-hover"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`w-12 h-12 rounded-lg bg-linear-to-r ${stat.color} flex items-center justify-center text-white text-2xl font-bold mb-3`}>
              {stat.value}
            </div>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="glass p-4 rounded-xl flex flex-wrap items-center gap-4 animate-slide-in-up">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Filter:</span>
          {['all', 'active', 'paused', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="glass p-12 rounded-xl text-center animate-fade-in">
          <div className="w-20 h-20 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            🚀
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No campaigns found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filter !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first campaign'}
          </p>
          {!searchQuery && filter === 'all' && (
            <button
              onClick={() => router.push('/campaigns/create')}
              className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Campaign</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredCampaigns.map((campaign, index) => (
            <div 
              key={campaign._id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CampaignCard 
                campaign={campaign} 
                onClick={() => router.push(`/campaigns/${campaign._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
