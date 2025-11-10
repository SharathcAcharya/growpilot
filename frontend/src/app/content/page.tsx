'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CONTENT_TYPES } from '@/lib/constants';
import { DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function ContentPage() {
  const [generating, setGenerating] = useState(false);
  const [content, setContent] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  // Load real content from API
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.getContent();
      setContent(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedContent(response.data.data[0]);
      }
    } catch (error) {
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
    try {
      setGenerating(true);
      const response = await api.generateContent({
        ...formData,
        keywords: formData.keywords.split(',').map((k) => k.trim()),
      });

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
      console.error('Failed to generate content:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate content. Please try again.';
      alert(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-linear-to-r from-blue-500 to-purple-600">
            <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Content Generator ✍️
            </h1>
            <p className="text-gray-200 text-sm sm:text-base mt-1">Create AI-powered content for your marketing campaigns</p>
          </div>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 group whitespace-nowrap"
        >
          <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />
          <span>Generate Content</span>
        </button>
      </div>

      {/* Content Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-purple-400" />
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Generate New Content
                </span>
              </h2>
              <button
                onClick={() => setShowGenerator(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">📝 Content Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
                >
                  <option value="blog" className="bg-gray-900">📰 Blog Post</option>
                  <option value="social_post" className="bg-gray-900">📱 Social Media Post</option>
                  <option value="ad_copy" className="bg-gray-900">📢 Ad Copy</option>
                  <option value="email" className="bg-gray-900">✉️ Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">💡 Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Summer Sale Campaign for Fashion Brand"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">🏷️ Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="summer, fashion, discount, sale"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">🎭 Tone</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
                  >
                    <option value="professional" className="bg-gray-900">💼 Professional</option>
                    <option value="casual" className="bg-gray-900">😊 Casual</option>
                    <option value="friendly" className="bg-gray-900">👋 Friendly</option>
                    <option value="formal" className="bg-gray-900">🎩 Formal</option>
                    <option value="persuasive" className="bg-gray-900">🎯 Persuasive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">📏 Length</label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:bg-white/15"
                  >
                    <option value="short" className="bg-gray-900">Short (200-300 words)</option>
                    <option value="medium" className="bg-gray-900">Medium (500-700 words)</option>
                    <option value="long" className="bg-gray-900">Long (1000-1500 words)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={generating || !formData.topic}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 group"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 hover:border-purple-400/50 transition-all font-semibold"
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
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-400/50 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600">
                <DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">{selectedContent.title}</h3>
                <p className="text-xs sm:text-sm text-gray-200 capitalize mt-1">
                  📝 {selectedContent.type?.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedContent.content);
                  alert('Content copied to clipboard! 📋');
                }}
                className="px-4 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:scale-105 text-sm font-semibold"
              >
                📋 Copy
              </button>
              <button className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 hover:border-purple-400/50 transition-all text-sm font-semibold">
                ✏️ Edit
              </button>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-white leading-relaxed">{selectedContent.content}</div>
            </div>
          </div>
          {selectedContent.metadata && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <p className="text-gray-200 mb-1">📝 Word Count</p>
                  <p className="text-lg font-semibold text-white">{selectedContent.metadata.wordCount}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <p className="text-gray-200 mb-1">⏱️ Reading Time</p>
                  <p className="text-lg font-semibold text-white">{selectedContent.metadata.readingTime} min</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <p className="text-gray-200 mb-1">🤖 AI Generated</p>
                  <p className="text-lg font-semibold text-green-400">✓ Yes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!generating && content.length === 0 && !selectedContent && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 sm:p-12 text-center hover:border-purple-400/30 transition-colors">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Ready to Create Amazing Content? ✨
            </h3>
            <p className="text-white mb-6">
              Click the "Generate Content" button above to create AI-powered content for your marketing campaigns!
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">📰 Blog Posts</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">📱 Social Media</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">📢 Ad Copy</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-white">✉️ Emails</span>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      {content.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-400/50 transition-all">
          <div className="px-4 sm:px-6 py-4 border-b border-white/10 bg-white/5">
            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
              <span className="mr-2">📚</span>
              Recent Content
            </h3>
          </div>
          <div className="divide-y divide-white/10">
            {content.map((item, index) => (
              <div
                key={item._id}
                onClick={() => setSelectedContent(item)}
                className={`px-4 sm:px-6 py-4 hover:bg-white/10 cursor-pointer transition-all group ${selectedContent?._id === item._id ? 'bg-white/10 border-l-4 border-purple-500' : ''}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white group-hover:text-purple-300 transition-colors truncate">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-200 capitalize mt-1">
                      📝 {item.type?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-200">
                    🕒 {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

