'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useCampaignStore } from '@/store/campaignStore';
import { useUserStore } from '@/store/userStore';
import CampaignCard from '@/components/CampaignCard';
import { ChartBarIcon, MegaphoneIcon, DocumentTextIcon, UserGroupIcon, SparklesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const { campaigns, setCampaigns } = useCampaignStore();
  const { firebaseUser, loading: authLoading } = useUserStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!authLoading && !firebaseUser) {
      router.push('/login');
      return;
    }

    if (firebaseUser) {
      fetchDashboardData();
    }
  }, [firebaseUser, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, campaignsRes] = await Promise.all([
        api.getDashboard(),
        api.getCampaigns({ limit: 5 }),
      ]);
      
      setDashboardData(dashboardRes.data.data);
      setCampaigns(campaignsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData(null);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-400">Loading your dashboard...</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Active Campaigns',
      value: dashboardData?.overview?.activeCampaigns || 0,
      icon: MegaphoneIcon,
      gradient: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      name: 'Total Content',
      value: dashboardData?.overview?.totalContent || 0,
      icon: DocumentTextIcon,
      gradient: 'from-green-500 to-emerald-500',
      change: '+8%',
    },
    {
      name: 'Influencers',
      value: dashboardData?.overview?.influencersShortlisted || 0,
      icon: UserGroupIcon,
      gradient: 'from-purple-500 to-pink-500',
      change: '+5%',
    },
    {
      name: 'Monthly Spend',
      value: `$${dashboardData?.overview?.monthlyBudgetUsed?.toLocaleString() || 0}`,
      icon: ChartBarIcon,
      gradient: 'from-orange-500 to-red-500',
      change: '+15%',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in-down">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome back!</h1>
          <p className="text-gray-400">Here's what's happening with your campaigns today.</p>
        </div>
        <button
          onClick={() => router.push('/campaigns/create')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="glass p-6 rounded-xl card-hover"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-green-400 text-sm font-semibold">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      {dashboardData?.performance && (
        <div className="glass p-8 rounded-xl animate-slide-in-up">
          <h2 className="text-2xl font-semibold gradient-text mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Impressions', value: dashboardData.performance.impressions, color: 'text-blue-400' },
              { label: 'Total Clicks', value: dashboardData.performance.clicks, color: 'text-green-400' },
              { label: 'Conversions', value: dashboardData.performance.conversions, color: 'text-purple-400' },
              { label: 'Total Spent', value: `$${dashboardData.performance.spent}`, color: 'text-orange-400' },
            ].map((metric, index) => (
              <div key={metric.label} className="text-center">
                <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
                <p className={`text-3xl font-bold ${metric.color}`}>
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Campaigns */}
      <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold gradient-text">Recent Campaigns</h2>
          <button
            onClick={() => router.push('/campaigns')}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            View All →
          </button>
        </div>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <div 
                key={campaign._id} 
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CampaignCard
                  campaign={campaign}
                  onClick={() => router.push(`/campaigns/${campaign._id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-12 rounded-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MegaphoneIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No campaigns yet</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first AI-powered campaign</p>
            <button
              onClick={() => router.push('/campaigns/create')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Create Campaign</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
