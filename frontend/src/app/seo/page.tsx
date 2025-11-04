'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { MagnifyingGlassIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export default function SEOPage() {
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [url, setUrl] = useState('');

  const handleAudit = async () => {
    if (!url) {
      alert('Please enter a URL to audit');
      return;
    }

    try {
      setAuditing(true);
      const response = await api.auditWebsite({
        url,
        brandId: 'default',
        type: 'page',
      });

      setAuditResult(response.data.data);
    } catch (error) {
      console.error('Failed to audit website:', error);
      alert('Failed to audit website. Please check the URL and try again.');
    } finally {
      setAuditing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SEO Audit Tool</h1>
        <p className="text-gray-600 mt-1">Analyze your website and get AI-powered SEO recommendations</p>
      </div>

      {/* URL Input */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAudit}
            disabled={auditing || !url}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {auditing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Audit Website</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audit Results */}
      {auditResult && (
        <>
          {/* Overall Scores */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(auditResult.scores).map(([key, value]: [string, any]) => (
              <div key={key} className="bg-white rounded-lg shadow p-4 text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(value)}`}>
                  {value}
                </div>
                <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className={`mt-2 h-2 rounded-full ${getScoreBgColor(value)}`}>
                  <div
                    className={`h-2 rounded-full ${value >= 80 ? 'bg-green-600' : value >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          {auditResult.aiInsights && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <LightBulbIcon className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
              </div>
              
              {auditResult.aiInsights.summary && (
                <p className="text-gray-700 mb-4">{auditResult.aiInsights.summary}</p>
              )}

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {auditResult.aiInsights.quickWins && auditResult.aiInsights.quickWins.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-green-700 mb-3">🎯 Quick Wins</h3>
                    <ul className="space-y-2">
                      {auditResult.aiInsights.quickWins.map((win: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {auditResult.aiInsights.topIssues && auditResult.aiInsights.topIssues.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-red-700 mb-3">⚠️ Top Issues</h3>
                    <ul className="space-y-2">
                      {auditResult.aiInsights.topIssues.map((issue: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-red-600 mr-2">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technical SEO Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2 text-blue-600" />
              Technical SEO Analysis
            </h2>

            <div className="space-y-6">
              {/* Meta Tags */}
              {auditResult.technicalSEO?.metaTags && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Meta Tags</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Title Tag</span>
                      <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasTitle ? 'text-green-600' : 'text-red-600'}`}>
                        {auditResult.technicalSEO.metaTags.hasTitle ? '✓ Present' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Meta Description</span>
                      <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasDescription ? 'text-green-600' : 'text-red-600'}`}>
                        {auditResult.technicalSEO.metaTags.hasDescription ? '✓ Present' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Open Graph Tags</span>
                      <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasOpenGraph ? 'text-green-600' : 'text-red-600'}`}>
                        {auditResult.technicalSEO.metaTags.hasOpenGraph ? '✓ Present' : '✗ Missing'}
                      </span>
                    </div>
                    {auditResult.technicalSEO.metaTags.titleLength && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">Title Length</span>
                        <span className="text-sm font-medium text-gray-900">
                          {auditResult.technicalSEO.metaTags.titleLength} chars
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Images */}
              {auditResult.technicalSEO?.images && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Images</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">{auditResult.technicalSEO.images.total}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Images</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{auditResult.technicalSEO.images.withAlt}</div>
                      <div className="text-sm text-gray-600 mt-1">With Alt Text</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">{auditResult.technicalSEO.images.withoutAlt}</div>
                      <div className="text-sm text-gray-600 mt-1">Missing Alt Text</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {auditResult.recommendations && auditResult.recommendations.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
              <div className="space-y-4">
                {auditResult.recommendations.map((rec: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">{rec.category}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{rec.issue}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.solution}</p>
                    <p className="text-sm text-blue-600">💡 {rec.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
