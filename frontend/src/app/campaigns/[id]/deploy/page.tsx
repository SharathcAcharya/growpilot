'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import Toast from '@/components/Toast';
import {
  ArrowLeftIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  duration?: string;
}

export default function CampaignDeployPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const { firebaseUser, loading: authLoading } = useUserStore();
  const [deploying, setDeploying] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [steps, setSteps] = useState<DeploymentStep[]>([
    {
      id: '1',
      title: 'Validating Campaign Settings',
      description: 'Checking budget, targeting, and platform configurations',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Creating Ad Accounts',
      description: 'Setting up accounts on selected platforms',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Generating Ad Creatives',
      description: 'AI is creating optimized ad content and visuals',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Configuring Targeting',
      description: 'Applying audience parameters across platforms',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Setting Up Tracking',
      description: 'Installing pixels and conversion tracking',
      status: 'pending',
    },
    {
      id: '6',
      title: 'Deploying to Platforms',
      description: 'Publishing campaigns to Facebook, Instagram, etc.',
      status: 'pending',
    },
    {
      id: '7',
      title: 'Activating Campaign',
      description: 'Starting ad delivery and monitoring',
      status: 'pending',
    },
  ]);

  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.push('/login');
    }
  }, [firebaseUser, authLoading, router]);

  const handleDeploy = async () => {
    setDeploying(true);

    // Simulate deployment process
    for (let i = 0; i < steps.length; i++) {
      // Update current step to in-progress
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'in-progress' as const } : step
      ));

      // Wait for step to complete
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Update current step to completed
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' as const, duration: `${(1.5 + Math.random()).toFixed(1)}s` } : step
      ));
    }

    setDeploymentComplete(true);
    setDeploying(false);
    setToastMessage('🎉 Campaign deployed successfully!');
    setShowToast(true);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-400" />;
      case 'in-progress':
        return <div className="spinner spinner-sm" />;
      case 'failed':
        return <XCircleIcon className="w-6 h-6 text-red-400" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'in-progress':
        return 'border-purple-500 bg-purple-500/10';
      case 'failed':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-700 bg-gray-800';
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-900 via-purple-900 to-black">
        <div className="spinner spinner-lg mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
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
              disabled={deploying}
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Deploy Campaign</h1>
              <p className="text-gray-400">
                {deploymentComplete 
                  ? 'Campaign is now live and running' 
                  : deploying 
                    ? 'Deploying your campaign to selected platforms...' 
                    : 'Ready to launch your campaign'}
              </p>
            </div>
          </div>

          {deploymentComplete && (
            <button
              onClick={() => router.push('/campaigns')}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              View All Campaigns
            </button>
          )}
        </div>

        {!deploying && !deploymentComplete && (
          <>
            {/* Pre-deployment Checklist */}
            <div className="glass p-8 rounded-xl animate-fade-in">
              <h2 className="text-2xl font-semibold text-white mb-6">Pre-Deployment Checklist</h2>
              <div className="space-y-4">
                {[
                  { label: 'Campaign name and description', status: true },
                  { label: 'Target platforms selected', status: true },
                  { label: 'Budget and schedule configured', status: true },
                  { label: 'Audience targeting defined', status: true },
                  { label: 'Ad creatives ready (AI-generated)', status: true },
                  { label: 'Tracking pixels installed', status: true },
                  { label: 'Payment method verified', status: true },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <span className="text-white">{item.label}</span>
                    {item.status ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    ) : (
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Info */}
            <div className="glass p-6 rounded-xl">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">💡 What happens during deployment?</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• AI will generate optimized ad creatives for each platform</li>
                  <li>• Your targeting settings will be applied across all selected platforms</li>
                  <li>• Tracking pixels will be automatically installed for analytics</li>
                  <li>• Budget allocation will be optimized based on platform performance</li>
                  <li>• Campaign will start running immediately after deployment</li>
                </ul>
              </div>
            </div>

            {/* Deploy Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDeploy}
                className="px-12 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center space-x-3 shadow-lg shadow-green-500/30"
              >
                <RocketLaunchIcon className="w-6 h-6" />
                <span>Deploy Campaign Now</span>
              </button>
            </div>
          </>
        )}

        {/* Deployment Progress */}
        {deploying && (
          <div className="glass p-8 rounded-xl animate-fade-in">
            <h2 className="text-2xl font-semibold text-white mb-6">Deployment in Progress</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border-2 transition-all ${getStepColor(step.status)}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0 mt-1">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">{step.title}</h3>
                        {step.duration && (
                          <span className="text-sm text-gray-400">{step.duration}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                      {step.status === 'in-progress' && (
                        <div className="mt-2 bg-gray-700 rounded-full h-1">
                          <div className="bg-purple-600 h-1 rounded-full animate-pulse-glow" style={{ width: '60%' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">This usually takes 10-15 seconds...</p>
            </div>
          </div>
        )}

        {/* Deployment Complete */}
        {deploymentComplete && (
          <div className="glass p-12 rounded-xl text-center animate-fade-in">
            <div className="w-24 h-24 bg-linear-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <RocketLaunchIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Campaign Deployed Successfully! 🎉</h2>
            <p className="text-gray-400 mb-8">
              Your campaign is now live and running on all selected platforms.
              <br />
              You can monitor its performance in real-time from the dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Platforms', value: '2 Active', color: 'text-blue-400' },
                { label: 'Status', value: 'Live', color: 'text-green-400' },
                { label: 'Daily Budget', value: '$150', color: 'text-purple-400' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push(`/campaigns/${campaignId}`)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                View Campaign Details
              </button>
              <button
                onClick={() => router.push('/campaigns')}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all"
              >
                Back to Campaigns
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
