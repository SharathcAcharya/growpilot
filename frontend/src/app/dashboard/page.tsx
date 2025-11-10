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
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-900 via-purple-900 to-black">
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
    <div className="min-h-screen space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-in-down">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 sm:mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Here's what's happening with your campaigns today.</p>
        </div>
        <button
          onClick={() => router.push('/campaigns/create')}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white text-sm sm:text-base rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-purple-500/50 group"
        >
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fade-in">
        {stats.map((stat, index) => (
          <div 
            key={stat.name} 
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-6 rounded-xl hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg bg-linear-to-r ${stat.gradient} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center text-green-400 text-xs sm:text-sm font-semibold px-2 py-1 bg-green-500/10 rounded-full">
                <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {stat.change}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">{stat.name}</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      {dashboardData?.performance && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 sm:p-6 md:p-8 rounded-xl animate-slide-in-up hover:border-purple-400/50 transition-all">
          <h2 className="text-xl sm:text-2xl font-semibold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 sm:mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-purple-400" />
            Performance Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Total Impressions', value: dashboardData.performance.impressions, color: 'text-blue-400', emoji: '👁️' },
              { label: 'Total Clicks', value: dashboardData.performance.clicks, color: 'text-green-400', emoji: '🖱️' },
              { label: 'Conversions', value: dashboardData.performance.conversions, color: 'text-purple-400', emoji: '🎯' },
              { label: 'Total Spent', value: `$${dashboardData.performance.spent}`, color: 'text-orange-400', emoji: '💰' },
            ].map((metric, index) => (
              <div key={metric.label} className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all hover:scale-105 group">
                <div className="text-2xl mb-2 group-hover:animate-bounce">{metric.emoji}</div>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">{metric.label}</p>
                <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${metric.color}`}>
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Campaigns */}
      <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center">
            <MegaphoneIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-400" />
            Recent Campaigns
          </h2>
          <button
            onClick={() => router.push('/campaigns')}
            className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-all hover:translate-x-1 flex items-center"
          >
            <span>View All</span>
            <span className="ml-1">→</span>
          </button>
        </div>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 sm:p-12 rounded-xl text-center hover:border-purple-400/50 transition-all">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <MegaphoneIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No campaigns yet</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6 max-w-md mx-auto">Get started by creating your first AI-powered campaign</p>
            <button
              onClick={() => router.push('/campaigns/create')}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white text-sm sm:text-base rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 inline-flex items-center justify-center space-x-2 shadow-lg group"
            >
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
              <span>Create Campaign</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

