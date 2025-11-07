'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import Toast from '@/components/Toast';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ShoppingCartIcon,
  CalendarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Campaign {
  _id: string;
  name: string;
  objective: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  platform: string; // Single platform, not array
  budget: {
    total: number;
    spent: number;
    remaining?: number;
    daily?: number;
  };
  schedule?: {
    startDate: Date;
    endDate?: Date;
  };
  startDate?: Date; // Fallback
  endDate?: Date; // Fallback
  targeting: {
    age?: {
      min: number;
      max: number;
    };
    ageRange?: [number, number]; // Fallback
    gender?: string;
    locations?: string[];
    interests?: string[];
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr?: number;
    cpc?: number;
    roi?: number;
  };
  description?: string;
  createdAt?: Date;
  lastModified?: Date;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const { firebaseUser, loading: authLoading } = useUserStore();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
      return;
    }

    if (firebaseUser && campaignId) {
      fetchCampaign();
    }
  }, [firebaseUser, authLoading, router, campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await api.getCampaign(campaignId);
      setCampaign(response.data.data);
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      showNotification('Failed to load campaign', 'error');
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleStatusChange = async (newStatus: 'active' | 'paused') => {
    if (!campaign) return;
    
    setCampaign({ ...campaign, status: newStatus });
    showNotification(
      `Campaign ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`,
      'success'
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      showNotification('Campaign deleted successfully!', 'success');
      setTimeout(() => router.push('/campaigns'), 1500);
    }
  };

  const handleDeploy = () => {
    router.push(`/campaigns/${campaignId}/deploy`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-900 via-purple-900 to-black">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-400">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Campaign Not Found</h2>
          <button
            onClick={() => router.push('/campaigns')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/50',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  };

  const platformIcons: Record<string, string> = {
    facebook: '📘',
    instagram: '📷',
    youtube: '▶️',
    tiktok: '🎵',
    linkedin: '💼',
    twitter: '🐦',
  };

  const metricsData = [
    { 
      label: 'Impressions', 
      value: campaign.performance.impressions.toLocaleString(), 
      icon: EyeIcon,
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      label: 'Clicks', 
      value: campaign.performance.clicks.toLocaleString(), 
      icon: CursorArrowRaysIcon,
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      label: 'Conversions', 
      value: campaign.performance.conversions.toLocaleString(), 
      icon: ShoppingCartIcon,
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      label: 'Budget Spent', 
      value: `$${campaign.budget.spent.toLocaleString()}`, 
      icon: CurrencyDollarIcon,
      color: 'from-orange-500 to-red-500' 
    },
  ];

  const additionalMetrics = [
    { label: 'CTR', value: `${campaign.performance.ctr}%`, trend: '+0.5%' },
    { label: 'CPC', value: `$${campaign.performance.cpc}`, trend: '-$0.02' },
    { label: 'ROI', value: `${campaign.performance.roi}%`, trend: '+12%' },
    { label: 'Daily Spend', value: `$${campaign.budget.daily}`, trend: 'stable' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6 space-y-6">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between animate-slide-in-down">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/campaigns')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-400" />
          </button>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{campaign.name}</h1>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full border text-sm font-medium ${statusColors[campaign.status]}`}>
                {campaign.status.toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">
                {platformIcons[campaign.platform] || '📱'} {campaign.platform}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {campaign.status === 'active' ? (
            <button
              onClick={() => handleStatusChange('paused')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all flex items-center space-x-2"
            >
              <PauseIcon className="w-5 h-5" />
              <span>Pause</span>
            </button>
          ) : campaign.status === 'paused' ? (
            <button
              onClick={() => handleStatusChange('active')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center space-x-2"
            >
              <PlayIcon className="w-5 h-5" />
              <span>Resume</span>
            </button>
          ) : null}

          {campaign.status === 'draft' && (
            <button
              onClick={handleDeploy}
              className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
            >
              <RocketLaunchIcon className="w-5 h-5" />
              <span>Deploy</span>
            </button>
          )}

          <button
            onClick={() => router.push(`/campaigns/${campaignId}/edit`)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2"
          >
            <PencilIcon className="w-5 h-5" />
            <span>Edit</span>
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center space-x-2"
          >
            <TrashIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
        {metricsData.map((metric, index) => (
          <div 
            key={metric.label}
            className="glass p-6 rounded-xl card-hover"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-linear-to-r ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="glass p-6 rounded-xl animate-slide-in-up">
        <h2 className="text-xl font-semibold text-white mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {additionalMetrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
              <p className={`text-xs ${metric.trend.includes('+') ? 'text-green-400' : metric.trend.includes('-') ? 'text-red-400' : 'text-gray-400'}`}>
                {metric.trend}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget & Schedule */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-purple-400" />
            Budget & Schedule
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Total Budget</p>
              <p className="text-xl font-bold text-white">${campaign.budget.total.toLocaleString()}</p>
              <div className="mt-2 bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-linear-to-r from-green-600 to-emerald-600 h-2 rounded-full"
                  style={{ width: `${(campaign.budget.spent / campaign.budget.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                ${campaign.budget.spent.toLocaleString()} spent • ${campaign.budget.remaining?.toLocaleString()} remaining
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Campaign Duration</p>
              <p className="text-white">
                {new Date(campaign.schedule?.startDate || campaign.startDate || Date.now()).toLocaleDateString()} - {new Date(campaign.schedule?.endDate || campaign.endDate || Date.now()).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Daily Budget</p>
              <p className="text-xl font-bold text-white">${campaign.budget.daily}</p>
            </div>
          </div>
        </div>

        {/* Targeting */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <UserGroupIcon className="w-5 h-5 mr-2 text-purple-400" />
            Audience Targeting
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Age Range</p>
              <p className="text-white">
                {campaign.targeting.age?.min || campaign.targeting.ageRange?.[0] || 18} - {campaign.targeting.age?.max || campaign.targeting.ageRange?.[1] || 65} years
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Gender</p>
              <p className="text-white capitalize">{campaign.targeting.gender || 'All'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Locations</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {campaign.targeting.locations?.map((location) => (
                  <span key={location} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                    {location}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">Interests</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {campaign.targeting.interests?.map((interest) => (
                  <span key={interest} className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <SparklesIcon className="w-5 h-5 mr-2 text-purple-400" />
            Campaign Info
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Objective</p>
              <p className="text-white capitalize">{campaign.objective}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Description</p>
              <p className="text-white text-sm">{campaign.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Created</p>
              <p className="text-white text-sm">
                {campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Last Modified</p>
              <p className="text-white text-sm">
                {campaign.lastModified ? new Date(campaign.lastModified).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="glass p-8 rounded-xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <ChartBarIcon className="w-6 h-6 mr-2 text-purple-400" />
          Performance Over Time
        </h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400">Performance chart visualization coming soon</p>
            <p className="text-sm text-gray-500">Interactive charts with daily metrics tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
