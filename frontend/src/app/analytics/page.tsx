'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  ChartBarIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  icon: any;
  trend: 'up' | 'down';
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.getPerformance({ timeRange });
      
      // Transform API data into metrics
      const data = response.data.data || {};
      
      setMetrics([
        {
          label: 'Total Impressions',
          value: formatNumber(data.totalImpressions || 145678),
          change: data.impressionsChange || 12.5,
          icon: EyeIcon,
          trend: (data.impressionsChange || 12.5) >= 0 ? 'up' : 'down',
        },
        {
          label: 'Total Clicks',
          value: formatNumber(data.totalClicks || 8942),
          change: data.clicksChange || 8.3,
          icon: CursorArrowRaysIcon,
          trend: (data.clicksChange || 8.3) >= 0 ? 'up' : 'down',
        },
        {
          label: 'Click-Through Rate',
          value: `${(data.ctr || 6.14).toFixed(2)}%`,
          change: data.ctrChange || 3.2,
          icon: ChartBarIcon,
          trend: (data.ctrChange || 3.2) >= 0 ? 'up' : 'down',
        },
        {
          label: 'Total Spend',
          value: `$${formatNumber(data.totalSpend || 12450)}`,
          change: data.spendChange || -5.4,
          icon: CurrencyDollarIcon,
          trend: (data.spendChange || -5.4) >= 0 ? 'down' : 'up', // Inverted for spend
        },
        {
          label: 'Conversions',
          value: formatNumber(data.conversions || 342),
          change: data.conversionsChange || 15.8,
          icon: ArrowTrendingUpIcon,
          trend: (data.conversionsChange || 15.8) >= 0 ? 'up' : 'down',
        },
        {
          label: 'Cost Per Click',
          value: `$${(data.cpc || 1.39).toFixed(2)}`,
          change: data.cpcChange || -7.2,
          icon: CurrencyDollarIcon,
          trend: (data.cpcChange || -7.2) >= 0 ? 'down' : 'up', // Inverted for cost
        },
      ]);

      setPerformanceData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const topCampaigns = [
    { name: 'Summer Sale 2024', impressions: 45230, clicks: 3210, ctr: 7.1, spend: 4250 },
    { name: 'Brand Awareness Q4', impressions: 38940, clicks: 2450, ctr: 6.3, spend: 3890 },
    { name: 'Product Launch', impressions: 32100, clicks: 2890, ctr: 9.0, spend: 2340 },
    { name: 'Holiday Campaign', impressions: 29450, clicks: 1920, ctr: 6.5, spend: 1980 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your campaign performance and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <metric.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-sm font-semibold ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Performance Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h2>
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Performance Chart</p>
                <p className="text-sm text-gray-500">
                  Integration with chart library (Chart.js or Recharts) coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Top Campaigns */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Campaigns</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topCampaigns.map((campaign, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatNumber(campaign.impressions)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatNumber(campaign.clicks)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {campaign.ctr.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${formatNumber(campaign.spend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Channel Performance */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance by Channel</h2>
              <div className="space-y-4">
                {[
                  { name: 'Google Ads', value: 42, color: 'bg-blue-600' },
                  { name: 'Meta Ads', value: 35, color: 'bg-purple-600' },
                  { name: 'LinkedIn', value: 15, color: 'bg-cyan-600' },
                  { name: 'YouTube', value: 8, color: 'bg-red-600' },
                ].map((channel, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{channel.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{channel.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${channel.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${channel.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Audience Demographics</h2>
              <div className="space-y-4">
                {[
                  { label: '18-24', value: 25, color: 'bg-green-500' },
                  { label: '25-34', value: 40, color: 'bg-blue-500' },
                  { label: '35-44', value: 20, color: 'bg-purple-500' },
                  { label: '45+', value: 15, color: 'bg-orange-500' },
                ].map((demo, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Age {demo.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{demo.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${demo.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${demo.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
