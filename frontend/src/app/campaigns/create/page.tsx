'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Toast from '@/components/Toast';
import {
  ArrowLeftIcon,
  SparklesIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
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
}

const objectives: { value: CampaignObjective; label: string; description: string; icon: string }[] = [
  { value: 'awareness', label: 'Brand Awareness', description: 'Increase brand visibility and reach', icon: '👁️' },
  { value: 'traffic', label: 'Website Traffic', description: 'Drive visitors to your website', icon: '🌐' },
  { value: 'engagement', label: 'Engagement', description: 'Get likes, comments, and shares', icon: '❤️' },
  { value: 'conversions', label: 'Conversions', description: 'Drive purchases and signups', icon: '🛒' },
  { value: 'leads', label: 'Lead Generation', description: 'Collect customer information', icon: '📋' },
];

const platforms: { value: Platform; label: string; gradient: string; icon: string }[] = [
  { value: 'facebook', label: 'Facebook', gradient: 'from-blue-500 to-blue-700', icon: '📘' },
  { value: 'instagram', label: 'Instagram', gradient: 'from-pink-500 to-purple-600', icon: '📷' },
  { value: 'youtube', label: 'YouTube', gradient: 'from-red-500 to-red-700', icon: '▶️' },
  { value: 'tiktok', label: 'TikTok', gradient: 'from-black to-pink-600', icon: '🎵' },
  { value: 'linkedin', label: 'LinkedIn', gradient: 'from-blue-600 to-blue-800', icon: '💼' },
  { value: 'twitter', label: 'Twitter', gradient: 'from-sky-400 to-blue-500', icon: '🐦' },
];

const popularInterests = [
  'Technology', 'Fashion', 'Fitness', 'Food & Dining', 'Travel', 'Gaming',
  'Beauty', 'Sports', 'Music', 'Business', 'Health', 'Education',
  'Entertainment', 'Shopping', 'Automotive', 'Real Estate'
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate form
      if (!formData.name.trim()) {
        showNotification('Please enter a campaign name', 'error');
        return;
      }
      
      if (formData.platforms.length === 0) {
        showNotification('Please select at least one platform', 'error');
        return;
      }

      // Transform frontend data to match backend schema
      const campaignPayload = {
        name: formData.name,
        objective: formData.objective,
        platform: formData.platforms.length > 1 ? 'multi' : formData.platforms[0],
        brandId: 'default', // Use default brand for now
        budget: {
          total: formData.budget.total,
          daily: formData.budget.daily,
          currency: 'USD',
          spent: 0,
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
        status: 'draft',
        creatives: [],
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
          roas: 0,
        },
        aiInsights: {
          suggestions: [],
          optimizationScore: 0,
        },
      };

      // Call API to create campaign
      const response = await api.createCampaign(campaignPayload);

      if (response.data.success) {
        showNotification('🎉 Campaign created successfully!', 'success');
        setTimeout(() => {
          router.push('/campaigns');
        }, 2000);
      }
    } catch (error: any) {
      showNotification(error.message || 'Failed to create campaign', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
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

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Campaign Basics</h2>
        <p className="text-gray-400">Let's start with the fundamentals</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Summer Sale 2024"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Campaign Objective *</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objectives.map((obj) => (
            <button
              key={obj.value}
              onClick={() => setFormData({ ...formData, objective: obj.value })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.objective === obj.value
                  ? 'border-purple-600 bg-purple-600/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-3xl">{obj.icon}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{obj.label}</h3>
                  <p className="text-sm text-gray-400">{obj.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your campaign goals and strategy..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Select Platforms</h2>
        <p className="text-gray-400">Choose where you want to run your campaign</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.value}
            onClick={() => togglePlatform(platform.value)}
            className={`p-6 rounded-xl border-2 transition-all ${
              formData.platforms.includes(platform.value)
                ? `border-purple-600 bg-linear-to-r ${platform.gradient} bg-opacity-20`
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{platform.icon}</div>
              <h3 className="font-semibold text-white">{platform.label}</h3>
              {formData.platforms.includes(platform.value) && (
                <CheckCircleIcon className="w-6 h-6 text-green-400 mx-auto mt-2" />
              )}
            </div>
          </button>
        ))}
      </div>

      {formData.platforms.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            ✅ Selected {formData.platforms.length} platform{formData.platforms.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Budget & Schedule</h2>
        <p className="text-gray-400">Set your budget and campaign duration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Total Budget ($) *</label>
          <div className="relative">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="number"
              value={formData.budget.total}
              onChange={(e) => setFormData({ 
                ...formData, 
                budget: { ...formData.budget, total: Number(e.target.value) }
              })}
              min="0"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Daily Budget ($)</label>
          <div className="relative">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="number"
              value={formData.budget.daily || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                budget: { ...formData.budget, daily: Number(e.target.value) }
              })}
              min="0"
              placeholder="Optional"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
          <div className="relative">
            <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">End Date *</label>
          <div className="relative">
            <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-purple-300 font-semibold mb-1">Budget Tip</p>
            <p className="text-xs text-gray-400">
              We recommend starting with a daily budget that's 5-10% of your total budget to test performance before scaling up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Audience Targeting</h2>
        <p className="text-gray-400">Define who will see your campaign</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Age Range</label>
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
          <span className="text-gray-400">years old</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Gender</label>
        <div className="flex space-x-4">
          {['all', 'male', 'female'].map((gender) => (
            <button
              key={gender}
              onClick={() => setFormData({
                ...formData,
                targeting: { ...formData.targeting, gender: gender as any }
              })}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                formData.targeting.gender === gender
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Interests (Select up to 5)
        </label>
        <div className="flex flex-wrap gap-2">
          {popularInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              disabled={formData.targeting.interests.length >= 5 && !formData.targeting.interests.includes(interest)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.targeting.interests.includes(interest)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {interest}
              {formData.targeting.interests.includes(interest) && ' ✓'}
            </button>
          ))}
        </div>
        {formData.targeting.interests.length > 0 && (
          <p className="text-sm text-gray-400 mt-2">
            {formData.targeting.interests.length}/5 interests selected
          </p>
        )}
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <UserGroupIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-300 font-semibold mb-1">Estimated Reach</p>
            <p className="text-xs text-gray-400">
              Based on your targeting, your campaign could reach approximately{' '}
              <span className="text-green-400 font-bold">2.5M - 3.2M people</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-in-down">
          <button
            onClick={() => router.push('/campaigns')}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Campaigns
          </button>
          <h1 className="text-4xl font-bold gradient-text mb-2">Create New Campaign</h1>
          <p className="text-gray-400">Step {step} of {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-600 to-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="glass p-8 rounded-2xl mb-6 animate-slide-in-up">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {step < totalSteps ? (
            <button
              onClick={() => setStep(Math.min(totalSteps, step + 1))}
              className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Next Step</span>
              <SparklesIcon className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="spinner spinner-sm"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Create Campaign</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
