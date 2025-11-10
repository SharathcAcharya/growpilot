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
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 rounded-xl bg-linear-to-r from-green-500 to-blue-600">
          <ChartBarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            SEO Audit Tool 🔍
          </h1>
          <p className="text-gray-200 text-sm sm:text-base mt-1">Analyze your website and get AI-powered SEO recommendations</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-400/50 transition-all">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="🌐 Enter website URL (e.g., https://example.com)"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
            />
          </div>
          <button
            onClick={handleAudit}
            disabled={auditing || !url}
            className="px-6 sm:px-8 py-3 bg-linear-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 group whitespace-nowrap"
          >
            {auditing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Object.entries(auditResult.scores).map(([key, value]: [string, any], index) => (
              <div 
                key={key} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-purple-400/50 hover:scale-105 transition-all group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${getScoreColor(value)}`}>
                  {value}
                </div>
                <div className="text-xs sm:text-sm text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${value >= 80 ? 'bg-linear-to-r from-green-500 to-emerald-400' : value >= 60 ? 'bg-linear-to-r from-yellow-500 to-orange-400' : 'bg-linear-to-r from-red-500 to-pink-400'}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights */}
          {auditResult.aiInsights && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-400/50 transition-all">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-linear-to-r from-purple-600 to-blue-600">
                  <LightBulbIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">AI Insights 🤖</h2>
              </div>
              
              {auditResult.aiInsights.summary && (
                <p className="text-white mb-6 leading-relaxed">{auditResult.aiInsights.summary}</p>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {auditResult.aiInsights.quickWins && auditResult.aiInsights.quickWins.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <h3 className="font-semibold text-green-400 mb-3 flex items-center">
                      <span className="mr-2">🎯</span>
                      Quick Wins
                    </h3>
                    <ul className="space-y-2">
                      {auditResult.aiInsights.quickWins.map((win: string, i: number) => (
                        <li key={i} className="text-sm text-white flex items-start">
                          <span className="text-green-400 mr-2 mt-0.5">✓</span>
                          <span>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {auditResult.aiInsights.topIssues && auditResult.aiInsights.topIssues.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <h3 className="font-semibold text-red-400 mb-3 flex items-center">
                      <span className="mr-2">⚠️</span>
                      Top Issues
                    </h3>
                    <ul className="space-y-2">
                      {auditResult.aiInsights.topIssues.map((issue: string, i: number) => (
                        <li key={i} className="text-sm text-white flex items-start">
                          <span className="text-red-400 mr-2 mt-0.5">•</span>
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-400/50 transition-all">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center">
              <div className="p-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 mr-3">
                <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              Technical SEO Analysis ⚙️
            </h2>

            <div className="space-y-6">
              {/* Meta Tags */}
              {auditResult.technicalSEO?.metaTags && (
                <div>
                  <h3 className="font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">🏷️</span>
                    Meta Tags
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                      <span className="text-sm text-gray-200">📄 Title Tag</span>
                      <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasTitle ? 'text-green-400' : 'text-red-400'}`}>
                        {auditResult.technicalSEO.metaTags.hasTitle ? '✓ Present' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                      <span className="text-sm text-gray-200">📝 Meta Description</span>
                      <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasDescription ? 'text-green-400' : 'text-red-400'}`}>
                        {auditResult.technicalSEO.metaTags.hasDescription ? '✓ Present' : '✗ Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                      <span className="text-sm text-gray-200">🌐 Open Graph Tags</span>
                      <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasOpenGraph ? 'text-green-400' : 'text-red-400'}`}>
                        {auditResult.technicalSEO.metaTags.hasOpenGraph ? '✓ Present' : '✗ Missing'}
                      </span>
                    </div>
                    {auditResult.technicalSEO.metaTags.titleLength && (
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                        <span className="text-sm text-gray-200">📏 Title Length</span>
                        <span className="text-sm font-medium text-white">
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
                  <h3 className="font-semibold text-white mb-3 flex items-center">
                    <span className="mr-2">🖼️</span>
                    Images
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="text-center p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg hover:bg-blue-500/20 transition-colors">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-400">{auditResult.technicalSEO.images.total}</div>
                      <div className="text-xs sm:text-sm text-gray-200 mt-2">📸 Total Images</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 border border-green-400/30 rounded-lg hover:bg-green-500/20 transition-colors">
                      <div className="text-2xl sm:text-3xl font-bold text-green-400">{auditResult.technicalSEO.images.withAlt}</div>
                      <div className="text-xs sm:text-sm text-gray-200 mt-2">✅ With Alt Text</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 border border-red-400/30 rounded-lg hover:bg-red-500/20 transition-colors">
                      <div className="text-2xl sm:text-3xl font-bold text-red-400">{auditResult.technicalSEO.images.withoutAlt}</div>
                      <div className="text-xs sm:text-sm text-gray-200 mt-2">❌ Missing Alt Text</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {auditResult.recommendations && auditResult.recommendations.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-400/50 transition-all">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center">
                <span className="mr-2">💡</span>
                Recommendations
              </h2>
              <div className="space-y-4">
                {auditResult.recommendations.map((rec: any, i: number) => (
                  <div 
                    key={i} 
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-purple-400/50 transition-all group"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-200">📂 {rec.category}</span>
                        </div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">{rec.issue}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-white mb-3 leading-relaxed">{rec.solution}</p>
                    <p className="text-sm text-blue-400 flex items-start">
                      <span className="mr-1">💡</span>
                      <span>{rec.impact}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!auditing && !auditResult && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 sm:p-12 text-center hover:border-purple-400/30 transition-colors">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-linear-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
              <ChartBarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Ready to Audit Your Website? 🔍
            </h3>
            <p className="text-white mb-6">
              Enter your website URL above to get a comprehensive SEO analysis with AI-powered recommendations!
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">✅ Meta Tag Analysis</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">📊 Performance Scores</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">🤖 AI Insights</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">💡 Actionable Tips</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

