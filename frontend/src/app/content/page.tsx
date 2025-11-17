'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * Single-file ContentPage with hero-bg styles included via styled-jsx global CSS.
 * - Drop into a Next.js `app` or `pages` directory (adjust import path for `api` if needed).
 * - The .hero-bg class provides the purple/blue/magenta vignette and forces white text.
 */

export default function ContentPage() {
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load real content from API
  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.getContent();
      setContent(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedContent(response.data.data[0]);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch content:', error);
      setContent([]);
    }
  };

  const [formData, setFormData] = useState({
    type: 'blog',
    topic: '',
    keywords: '',
    tone: 'professional',
    length: 'medium',
    brandId: 'default',
    platform: 'website',
  });

  const handleGenerate = async () => {
    // Clear previous errors
    setError(null);

    // Validation
    if (!formData.topic || formData.topic.trim() === '') {
      setError('⚠️ Please enter a topic for your content');
      return;
    }

    if (!formData.keywords || formData.keywords.trim() === '') {
      setError('⚠️ Please enter at least one keyword');
      return;
    }

    try {
      setGenerating(true);
      
      // eslint-disable-next-line no-console
      console.log('Generating content with data:', {
        ...formData,
        keywords: formData.keywords.split(',').map((k) => k.trim()).filter(k => k),
      });

      const response = await api.generateContent({
        ...formData,
        keywords: formData.keywords.split(',').map((k) => k.trim()).filter(k => k),
      });

      // eslint-disable-next-line no-console
      console.log('Content generated successfully:', response.data);

      setContent([response.data.data, ...content]);
      setSelectedContent(response.data.data);
      setShowGenerator(false);
      setFormData({
        type: 'blog',
        topic: '',
        keywords: '',
        tone: 'professional',
        length: 'medium',
        brandId: 'default',
        platform: 'website',
      });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to generate content:', error);
      
      let errorMessage = 'Failed to generate content. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        // eslint-disable-next-line no-console
        console.error('Server error response:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Please check if the backend is running on port 5000.';
        // eslint-disable-next-line no-console
        console.error('No response from server:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="hero-bg min-h-screen w-full text-white antialiased">
      <div className="min-h-screen w-full max-w-7xl mx-auto p-6 lg:px-12 lg:py-10">
        <div className="min-h-[calc(100vh-64px)] w-full bg-blue-900/30 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-blue-900/30 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-900/40">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-blue-200 via-white to-pink-200">
                  Content Generator ✍️
                </h1>
                <p className="text-sm sm:text-base mt-1 text-white/85">
                  Create AI-powered content for your marketing campaigns
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowGenerator(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-transform transform hover:scale-105 shadow-lg"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="font-semibold">Generate Content</span>
              </button>
            </div>
          </div>

          {/* Generator Modal */}
          {showGenerator && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => { if (!generating) setShowGenerator(false); }}
                aria-hidden
              />

              <div className="relative z-10 w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-blue-950/80 border border-blue-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-blue-300" />
                    <span className="text-white">Generate New Content</span>
                  </h2>
                  <button
                    onClick={() => { if (!generating) setShowGenerator(false); }}
                    className="text-white/80 hover:text-white hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                    aria-label="Close generator"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">📝 Content Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2.5 bg-blue-900/50 border border-blue-500/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="blog">📰 Blog Post</option>
                      <option value="social_post">📱 Social Media Post</option>
                      <option value="ad_copy">📢 Ad Copy</option>
                      <option value="email">✉️ Email</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">💡 Topic</label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="e.g., Summer Sale Campaign for Fashion Brand"
                      className="w-full px-4 py-2.5 bg-blue-900/50 border border-blue-500/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">🏷️ Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="summer, fashion, discount, sale"
                      className="w-full px-4 py-2.5 bg-blue-900/50 border border-blue-500/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">🎭 Tone</label>
                      <select
                        value={formData.tone}
                        onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-blue-900/50 border border-blue-500/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="professional">💼 Professional</option>
                        <option value="casual">😊 Casual</option>
                        <option value="friendly">👋 Friendly</option>
                        <option value="formal">🎩 Formal</option>
                        <option value="persuasive">🎯 Persuasive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">📏 Length</label>
                      <select
                        value={formData.length}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        className="w-full px-4 py-2.5 bg-blue-900/50 border border-blue-500/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="short">Short (200-300 words)</option>
                        <option value="medium">Medium (500-700 words)</option>
                        <option value="long">Long (1000-1500 words)</option>
                      </select>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-white">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        {error}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-4">
                    <button
                      onClick={handleGenerate}
                      disabled={generating || !formData.topic}
                      className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl transition-transform transform hover:scale-105 disabled:opacity-60"
                    >
                      {generating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5" />
                          <span>Generate with AI</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => { setShowGenerator(false); setError(null); }}
                      className="px-6 py-3 bg-blue-900/50 border border-blue-500/30 rounded-xl text-white hover:bg-blue-800/40 transition-colors"
                      disabled={generating}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Preview */}
          {selectedContent && (
            <div className="w-full bg-blue-900/30 rounded-xl p-4 sm:p-6 border border-blue-500/20 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 shadow">
                    <DocumentTextIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{selectedContent.title}</h3>
                    <p className="text-xs sm:text-sm text-white/75 mt-1">📝 {selectedContent.type?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedContent.content);
                      alert('Content copied to clipboard! 📋');
                    }}
                    className="px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:scale-105 transition-transform"
                  >
                    📋 Copy
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-900/50 border border-blue-500/30 rounded-lg text-white hover:bg-blue-800/40 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>

              <div className="bg-blue-950/60 p-4 sm:p-6 rounded-lg border border-blue-500/20">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-white leading-relaxed">{selectedContent.content}</div>
                </div>
              </div>

              {selectedContent.metadata && (
                <div className="mt-6 pt-6 border-t border-blue-500/15">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-blue-900/40 rounded-lg border border-blue-500/15">
                      <p className="text-white/80 mb-1">📝 Word Count</p>
                      <p className="text-lg font-semibold text-white">{selectedContent.metadata.wordCount}</p>
                    </div>
                    <div className="p-3 bg-blue-900/40 rounded-lg border border-blue-500/15">
                      <p className="text-white/80 mb-1">⏱️ Reading Time</p>
                      <p className="text-lg font-semibold text-white">{selectedContent.metadata.readingTime} min</p>
                    </div>
                    <div className="p-3 bg-blue-900/40 rounded-lg border border-blue-500/15">
                      <p className="text-white/80 mb-1">🤖 AI Generated</p>
                      <p className="text-lg font-semibold text-green-400">✓ Yes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!generating && content.length === 0 && !selectedContent && (
            <div className="w-full bg-blue-900/30 rounded-xl p-8 sm:p-12 text-center border border-blue-500/20 shadow-lg">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full flex items-center justify-center border border-blue-400/20 bg-linear-to-br from-blue-700/30 to-purple-700/30">
                  <DocumentTextIcon className="w-10 h-10 text-blue-200 animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to Create Amazing Content? ✨</h3>
                <p className="text-white/85 mb-6">Click the "Generate Content" button above to create AI-powered content for your marketing campaigns!</p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-500/15 rounded-lg text-white/90">📰 Blog Posts</span>
                  <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-500/15 rounded-lg text-white/90">📱 Social Media</span>
                  <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-500/15 rounded-lg text-white/90">📢 Ad Copy</span>
                  <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-500/15 rounded-lg text-white/90">✉️ Emails</span>
                </div>
              </div>
            </div>
          )}

          {/* Content List */}
          {content.length > 0 && (
            <div className="w-full bg-blue-900/30 rounded-xl overflow-hidden border border-blue-500/20 shadow-lg">
              <div className="px-4 sm:px-6 py-4 border-b border-blue-500/15 bg-blue-900/40">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <span>📚</span> Recent Content
                </h3>
              </div>

              <div className="divide-y divide-blue-500/15">
                {content.map((item, index) => (
                  <div
                    key={item._id ?? index}
                    onClick={() => setSelectedContent(item)}
                    className={`px-4 sm:px-6 py-4 hover:bg-blue-900/40 cursor-pointer transition-all ${selectedContent?._id === item._id ? 'bg-blue-900/40 border-l-4 border-blue-500' : ''}`}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-white/75 mt-1">📝 {item.type?.replace('_', ' ')}</p>
                      </div>
                      <div className="text-xs sm:text-sm text-white/70">
                        🕒 {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global CSS included here using styled-jsx (scoped globally) */}
      <style jsx global>{`
        :root {
          --hero-left: #0b1220;
          --hero-right: #4b0f66;
          --hero-blue: #183a8a;
          --hero-magenta: #b93aa6;
        }

        /* hero background */
        .hero-bg {
          background-image:
            radial-gradient(40% 35% at 22% 30%, rgba(24,58,138,0.40) 0%, rgba(24,58,138,0.06) 20%, transparent 40%),
            radial-gradient(30% 30% at 72% 24%, rgba(185,58,166,0.36) 0%, rgba(185,58,166,0.04) 20%, transparent 45%),
            linear-gradient(180deg, rgba(11,18,32,1) 0%, rgba(75,15,102,0.98) 35%, rgba(75,15,102,0.96) 100%);
          background-repeat: no-repeat;
          background-size: cover, cover, cover;
          background-position: left center, right center, center center;
          position: relative;
          color: #fff;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .hero-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 100%),
            radial-gradient(60% 40% at 50% 70%, rgba(0,0,0,0.08), transparent 40%);
          mix-blend-mode: multiply;
        }

        .hero-bg::after {
          content: "";
          position: absolute;
          left: 40%;
          top: 30%;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(80px);
          background: radial-gradient(circle at 40% 30%, rgba(36,100,255,0.12), rgba(36,100,255,0.02) 40%, transparent 60%),
                      radial-gradient(circle at 70% 60%, rgba(185,58,166,0.10), transparent 30%);
          pointer-events: none;
          transform: translate(-10%, -10%);
        }

        .hero-bg > * { position: relative; z-index: 1; }

        .hero-bg img {
          filter: brightness(1.05) contrast(1.05) saturate(1.05) drop-shadow(0 6px 18px rgba(2,6,23,0.45));
          -webkit-filter: brightness(1.05) contrast(1.05) saturate(1.05) drop-shadow(0 6px 18px rgba(2,6,23,0.45));
        }

        .hero-bg .card, .hero-bg .panel, .hero-bg .modal {
          background: rgba(2,6,23,0.30);
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
        }

        .hero-bg input, .hero-bg textarea, .hero-bg select {
          color: #fff;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .hero-bg ::placeholder { color: rgba(255,255,255,0.6); }

        .hero-bg h1, .hero-bg h2, .hero-bg h3, .hero-bg h4 {
          color: #fff;
          text-shadow: 0 6px 20px rgba(11,18,32,0.45);
        }

        .hero-bg .muted, .hero-bg small, .hero-bg .meta {
          color: rgba(255,255,255,0.78);
        }

        @media (max-width: 640px) {
          .hero-bg::after { width: 300px; height: 300px; filter: blur(60px); left: 50%; top: 28%; }
          .hero-bg::before { background: linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.16)); }
        }
      `}</style>
    </div>
  );
}
