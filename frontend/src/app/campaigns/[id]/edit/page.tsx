'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import Toast from '@/components/Toast';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

type CampaignObjective = 'awareness' | 'traffic' | 'engagement' | 'conversions' | 'leads';
type Platform = 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'linkedin' | 'twitter';

interface CampaignFormData {
  name: string;
  objective: CampaignObjective;
  platforms: Platform[];
  budget: {
    total: number;
    daily?: number;
  };
  startDate: string;
  endDate: string;
  targeting: {
    ageRange: [number, number];
    gender: 'all' | 'male' | 'female';
    locations: string[];
    interests: string[];
  };
  description?: string;
  status: string;
}

const popularInterests = [
  'Technology', 'Fashion', 'Fitness', 'Food & Dining', 'Travel', 'Gaming',
  'Beauty', 'Sports', 'Music', 'Business', 'Health', 'Education',
  'Entertainment', 'Shopping', 'Automotive', 'Real Estate'
];

const platforms: { value: Platform; label: string; icon: string }[] = [
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'twitter', label: 'Twitter', icon: '🐦' },
];

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const { firebaseUser, loading: authLoading } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    objective: 'awareness',
    platforms: [],
    budget: { total: 1000, daily: 100 },
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targeting: {
      ageRange: [18, 65],
      gender: 'all',
      locations: ['United States'],
      interests: [],
    },
    description: '',
    status: 'draft',
  });

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
      
      if (response.data.data) {
        const campaign = response.data.data;
        
        // Transform backend data to form data structure
        const startDate = campaign.schedule?.startDate || campaign.startDate;
        const endDate = campaign.schedule?.endDate || campaign.endDate;
        
        setFormData({
          name: campaign.name,
          objective: campaign.objective,
          platforms: campaign.platform ? [campaign.platform] : [],
          budget: campaign.budget,
          startDate: typeof startDate === 'string' ? startDate : new Date(startDate).toISOString().split('T')[0],
          endDate: typeof endDate === 'string' ? endDate : new Date(endDate).toISOString().split('T')[0],
          targeting: {
            ageRange: campaign.targeting.age 
              ? [campaign.targeting.age.min, campaign.targeting.age.max]
              : campaign.targeting.ageRange || [18, 65],
            gender: campaign.targeting.gender || 'all',
            locations: campaign.targeting.locations || ['United States'],
            interests: campaign.targeting.interests || [],
          },
          description: campaign.description,
          status: campaign.status,
        });
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      showNotification('Failed to load campaign', 'error');
      router.push('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      if (!formData.name.trim()) {
        showNotification('Please enter a campaign name', 'error');
        return;
      }

      // Transform form data to match backend schema
      const updatePayload = {
        name: formData.name,
        objective: formData.objective,
        platform: formData.platforms.length > 1 ? 'multi' : formData.platforms[0],
        budget: {
          total: formData.budget.total,
          daily: formData.budget.daily,
          currency: 'USD',
        },
        schedule: {
          startDate: new Date(formData.startDate),
          endDate: formData.endDate ? new Date(formData.endDate) : undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        targeting: {
          age: {
            min: formData.targeting.ageRange[0],
            max: formData.targeting.ageRange[1],
          },
          gender: formData.targeting.gender,
          locations: formData.targeting.locations,
          interests: formData.targeting.interests,
        },
        description: formData.description,
        status: formData.status,
      };

      await api.updateCampaign(campaignId, updatePayload);
      showNotification('✅ Campaign updated successfully!', 'success');
      setTimeout(() => {
        router.push(`/campaigns/${campaignId}`);
      }, 1500);
    } catch (error: any) {
      showNotification(error.message || 'Failed to update campaign', 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePlatform = (platform: Platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      targeting: {
        ...prev.targeting,
        interests: prev.targeting.interests.includes(interest)
          ? prev.targeting.interests.filter(i => i !== interest)
          : [...prev.targeting.interests, interest]
      }
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-900 via-purple-900 to-black">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-400">Loading campaign...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-in-down">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/campaigns/${campaignId}`)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Edit Campaign</h1>
              <p className="text-gray-400">Update your campaign settings</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/campaigns/${campaignId}`)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="spinner spinner-sm"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="glass p-8 rounded-2xl space-y-8 animate-fade-in">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Platforms</h2>
            <div className="grid grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => togglePlatform(platform.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.platforms.includes(platform.value)
                      ? 'border-purple-600 bg-purple-600/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{platform.icon}</div>
                    <span className="text-sm text-white">{platform.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Budget</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Budget ($)</label>
                <input
                  type="number"
                  value={formData.budget.total}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    budget: { ...formData.budget, total: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Daily Budget ($)</label>
                <input
                  type="number"
                  value={formData.budget.daily || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    budget: { ...formData.budget, daily: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Targeting */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Audience Targeting</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age Range</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={formData.targeting.ageRange[0]}
                    onChange={(e) => setFormData({
                      ...formData,
                      targeting: {
                        ...formData.targeting,
                        ageRange: [Number(e.target.value), formData.targeting.ageRange[1]]
                      }
                    })}
                    min="13"
                    max="65"
                    className="w-24 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    value={formData.targeting.ageRange[1]}
                    onChange={(e) => setFormData({
                      ...formData,
                      targeting: {
                        ...formData.targeting,
                        ageRange: [formData.targeting.ageRange[0], Number(e.target.value)]
                      }
                    })}
                    min="13"
                    max="65"
                    className="w-24 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {popularInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        formData.targeting.interests.includes(interest)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
