'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCampaignStore } from '@/store/campaignStore';
import CampaignCard from '@/components/CampaignCard';
import { ChartBarIcon, MegaphoneIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const { campaigns, setCampaigns } = useCampaignStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, campaignsRes] = await Promise.all([
        api.getDashboard(),
        api.getCampaigns({ limit: 5 }),
      ]);
      
      setDashboardData(dashboardRes.data.data);
      setCampaigns(campaignsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Active Campaigns',
      value: dashboardData?.overview.activeCampaigns || 0,
      icon: MegaphoneIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Content',
      value: dashboardData?.overview.totalContent || 0,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Influencers',
      value: dashboardData?.overview.influencersShortlisted || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Monthly Spend',
      value: `$${dashboardData?.overview.monthlyBudgetUsed?.toLocaleString() || 0}`,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => router.push('/campaigns/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Campaign
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      {dashboardData?.performance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.performance.impressions.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.performance.clicks.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversions</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.performance.conversions.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData.performance.spent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
          <button
            onClick={() => router.push('/campaigns')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                onClick={() => router.push(`/campaigns/${campaign._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MegaphoneIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first AI-powered campaign</p>
            <button
              onClick={() => router.push('/campaigns/create')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
