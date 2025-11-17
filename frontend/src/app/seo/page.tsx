'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { MagnifyingGlassIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export default function SEOPage() {
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async () => {
    if (!url) {
      setError('⚠️ Please enter a URL to audit');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      setError('⚠️ Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    try {
      setAuditing(true);
      setError(null);
      
      const response = await api.auditWebsite({
        url,
        brandId: 'default',
        type: 'page',
      });

      setAuditResult(response.data.data);
    } catch (error: any) {
      console.error('Failed to audit website:', error);
      
      let errorMessage = 'Failed to audit website. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setAuditing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-800/30';
    if (score >= 60) return 'bg-yellow-800/20';
    return 'bg-red-800/20';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600/20 text-red-300';
      case 'high':
        return 'bg-orange-600/18 text-orange-200';
      case 'medium':
        return 'bg-yellow-600/12 text-yellow-200';
      case 'low':
        return 'bg-blue-600/12 text-blue-200';
      default:
        return 'bg-white/6 text-white/80';
    }
  };

  return (
    <div className="min-h-screen w-full page-bg text-white py-8 px-6">
      {/* Top header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-linear-to-r from-green-500 to-blue-600 shadow-lg shadow-blue-500/20">
            <ChartBarIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-green-300 via-blue-300 to-purple-300">
              SEO Audit Tool 🔍
            </h1>
            <p className="text-sm text-white/80 mt-1">
              Analyze your website and get AI-powered SEO recommendations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* URL Input */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); }}
              placeholder="🌐 Enter website URL (e.g., https://example.com)"
              className="flex-1 px-4 py-3 bg-white/6 border border-white/12 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={handleAudit}
              disabled={auditing || !url}
              className="px-6 sm:px-8 py-3 bg-linear-to-r from-green-600 to-blue-600 rounded-xl text-white font-semibold flex items-center gap-3 disabled:opacity-60"
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
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-white">
              <p className="text-sm font-medium flex items-center gap-2">
                <span className="text-xl">❌</span>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Audit Results */}
        {auditResult && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(auditResult.scores || {}).map(([key, value]: [string, any], index) => (
                <div
                  key={key}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(value)}`}>{value}</div>
                  <div className="text-xs text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${value >= 80 ? 'bg-linear-to-r from-green-400 to-emerald-300' : value >= 60 ? 'bg-linear-to-r from-yellow-400 to-orange-400' : 'bg-linear-to-r from-red-400 to-red-500'}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insights */}
            {auditResult.aiInsights && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-linear-to-r from-purple-600 to-blue-600">
                    <LightBulbIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">AI Insights 🤖</h2>
                </div>

                {auditResult.aiInsights.summary && (
                  <p className="text-white/85 mb-4 leading-relaxed">{auditResult.aiInsights.summary}</p>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {auditResult.aiInsights.quickWins && auditResult.aiInsights.quickWins.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-green-300 mb-3 flex items-center gap-2">🎯 Quick Wins</h3>
                      <ul className="space-y-2">
                        {auditResult.aiInsights.quickWins.map((w: string, i: number) => (
                          <li key={i} className="text-white/90 flex items-start gap-2">
                            <span className="text-green-300 mt-0.5">✓</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {auditResult.aiInsights.topIssues && auditResult.aiInsights.topIssues.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold text-red-300 mb-3 flex items-center gap-2">⚠️ Top Issues</h3>
                      <ul className="space-y-2">
                        {auditResult.aiInsights.topIssues.map((t: string, i: number) => (
                          <li key={i} className="text-white/90 flex items-start gap-2">
                            <span className="text-red-300 mt-0.5">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical SEO */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                Technical SEO Analysis ⚙️
              </h2>

              <div className="space-y-6">
                {/* Meta Tags */}
                {auditResult.technicalSEO?.metaTags && (
                  <div>
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">🏷️ Meta Tags</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 bg-white/6 rounded-lg border border-white/8">
                        <span className="text-sm text-white/80">📄 Title Tag</span>
                        <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasTitle ? 'text-green-300' : 'text-red-300'}`}>
                          {auditResult.technicalSEO.metaTags.hasTitle ? '✓ Present' : '✗ Missing'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/6 rounded-lg border border-white/8">
                        <span className="text-sm text-white/80">📝 Meta Description</span>
                        <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasDescription ? 'text-green-300' : 'text-red-300'}`}>
                          {auditResult.technicalSEO.metaTags.hasDescription ? '✓ Present' : '✗ Missing'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/6 rounded-lg border border-white/8">
                        <span className="text-sm text-white/80">🌐 Open Graph</span>
                        <span className={`text-sm font-medium ${auditResult.technicalSEO.metaTags.hasOpenGraph ? 'text-green-300' : 'text-red-300'}`}>
                          {auditResult.technicalSEO.metaTags.hasOpenGraph ? '✓ Present' : '✗ Missing'}
                        </span>
                      </div>

                      {auditResult.technicalSEO.metaTags.titleLength && (
                        <div className="flex items-center justify-between p-3 bg-white/6 rounded-lg border border-white/8">
                          <span className="text-sm text-white/80">📏 Title Length</span>
                          <span className="text-sm font-medium text-white">{auditResult.technicalSEO.metaTags.titleLength} chars</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Images */}
                {auditResult.technicalSEO?.images && (
                  <div>
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">🖼️ Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="text-center p-4 rounded-lg bg-blue-800/10 border border-blue-400/20">
                        <div className="text-2xl font-bold text-blue-300">{auditResult.technicalSEO.images.total}</div>
                        <div className="text-xs text-white/80 mt-2">📸 Total Images</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-800/10 border border-green-400/20">
                        <div className="text-2xl font-bold text-green-300">{auditResult.technicalSEO.images.withAlt}</div>
                        <div className="text-xs text-white/80 mt-2">✅ With Alt Text</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-red-800/10 border border-red-400/20">
                        <div className="text-2xl font-bold text-red-300">{auditResult.technicalSEO.images.withoutAlt}</div>
                        <div className="text-xs text-white/80 mt-2">❌ Missing Alt Text</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {auditResult.recommendations && auditResult.recommendations.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-white mb-4">💡 Recommendations</h2>
                <div className="space-y-4">
                  {auditResult.recommendations.map((rec: any, i: number) => (
                    <div key={i} className="bg-white/6 border border-white/8 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(rec.priority)}`}>{rec.priority.toUpperCase()}</span>
                            <span className="text-xs text-white/80">📂 {rec.category}</span>
                          </div>
                          <h3 className="font-semibold text-white">{rec.issue}</h3>
                        </div>
                      </div>
                      <p className="text-white/90 mb-2">{rec.solution}</p>
                      <p className="text-sm text-blue-300 flex items-start gap-2"><span>💡</span>{rec.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!auditing && !auditResult && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-linear-to-br from-green-500/20 to-blue-500/20">
                <ChartBarIcon className="w-10 h-10 text-green-300 animate-pulse" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to Audit Your Website? 🔍</h3>
              <p className="text-white/80 mb-6">Enter your website URL above to get a comprehensive SEO analysis with AI-powered recommendations!</p>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1.5 bg-white/8 rounded-lg text-white">✅ Meta Tag Analysis</span>
                <span className="px-3 py-1.5 bg-white/8 rounded-lg text-white">📊 Performance Scores</span>
                <span className="px-3 py-1.5 bg-white/8 rounded-lg text-white">🤖 AI Insights</span>
                <span className="px-3 py-1.5 bg-white/8 rounded-lg text-white">💡 Actionable Tips</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global styles to enforce full-viewport themed background and style selects/options */}
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          background: linear-gradient(135deg, #07081a 0%, #2c0f3b 40%, #4f0f6a 70%, #7b1f9a 100%);
        }

        .page-bg {
          /* layered radial highlights to match the purple/indigo theme */
          background:
            radial-gradient(420px 240px at 12% 12%, rgba(47, 84, 255, 0.10), transparent 20%),
            radial-gradient(420px 280px at 85% 14%, rgba(255, 70, 160, 0.08), transparent 20%),
            linear-gradient(135deg, #07081a 0%, #2c0f3b 40%, #4f0f6a 70%, #7b1f9a 100%);
          min-height: 100vh;
        }

        /* Ensure native selects and options match the theme */
        select, option {
          color: #ffffff;
          background-color: rgba(6, 6, 10, 0.32);
        }

        /* For browsers that render option lists in a separate UI, attempt to keep contrast */
        option {
          padding: 8px 12px;
          color: #ffffff;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        }

        /* Appearance tweaks so select caret doesn't look odd on dark bg */
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, #fff 50%),
                            linear-gradient(135deg, #fff 50%, transparent 50%),
                            linear-gradient(to right, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px), 100% 0;
          background-size: 6px 6px, 6px 6px, 1px 100%;
          background-repeat: no-repeat;
        }

        /* Focus ring and option highlight */
        select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.18);
        }

        /* Make sure emoji render clearly: increase option font-size a bit */
        option {
          font-size: 15px;
        }

        /* small scrollbar adjustments */
        ::-webkit-scrollbar {
          height: 10px;
          width: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
