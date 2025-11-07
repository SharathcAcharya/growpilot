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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Generator</h1>
          <p className="text-gray-600 mt-1">Create AI-powered content for your marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Generate Content</span>
        </button>
      </div>

      {/* Content Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Generate New Content</h2>
              <button
                onClick={() => setShowGenerator(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="blog">Blog Post</option>
                  <option value="social_post">Social Media Post</option>
                  <option value="ad_copy">Ad Copy</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Summer Sale Campaign for Fashion Brand"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="summer, fashion, discount, sale"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="short">Short (200-300 words)</option>
                    <option value="medium">Medium (500-700 words)</option>
                    <option value="long">Long (1000-1500 words)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={generating || !formData.topic}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                  onClick={() => setShowGenerator(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedContent.title}</h3>
                <p className="text-sm text-gray-500 capitalize">{selectedContent.type?.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Publish
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{selectedContent.content}</div>
          </div>
          {selectedContent.metadata && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Word Count</p>
                  <p className="font-semibold text-gray-900">{selectedContent.metadata.wordCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reading Time</p>
                  <p className="font-semibold text-gray-900">{selectedContent.metadata.readingTime} min</p>
                </div>
                <div>
                  <p className="text-gray-500">AI Generated</p>
                  <p className="font-semibold text-green-600">✓ Yes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content List */}
      {content.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Content</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {content.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedContent(item)}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500 capitalize mt-1">{item.type?.replace('_', ' ')}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
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
