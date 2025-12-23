import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 120 seconds for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get Firebase auth token
    if (auth && auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Firebase token added to request:', config.url);
      } catch (error) {
        console.error('❌ Failed to get Firebase auth token:', error);
      }
    } else {
      console.warn('⚠️ No authenticated user - request will be unauthorized');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // User
  getCurrentUser: () => apiClient.get('/users/me'),
  updateUser: (data: any) => apiClient.put('/users/me', data),
  getUsageStats: () => apiClient.get('/users/usage'),

  // Campaigns
  getCampaigns: (params?: any) => apiClient.get('/campaigns', { params }),
  getCampaign: (id: string) => apiClient.get(`/campaigns/${id}`),
  createCampaign: (data: any) => apiClient.post('/campaigns/create', data),
  updateCampaign: (id: string, data: any) => apiClient.put(`/campaigns/${id}`, data),
  deleteCampaign: (id: string) => apiClient.delete(`/campaigns/${id}`),
  generateCreative: (id: string, data: any) => apiClient.post(`/campaigns/${id}/generate-creative`, data),
  generateCampaignCreative: (id: string, data: any) => apiClient.post(`/campaigns/${id}/generate-creative`, data),
  deployCampaign: (id: string) => apiClient.post(`/campaigns/${id}/deploy`),
  optimizeCampaign: (id: string) => apiClient.post(`/campaigns/${id}/optimize`),
  getCampaignAnalytics: (id: string) => apiClient.get(`/campaigns/${id}/analytics`),

  // Content
  generateContent: (data: any) => apiClient.post('/content/generate', data),
  getContent: (params?: any) => apiClient.get('/content', { params }),
  getContentById: (id: string) => apiClient.get(`/content/${id}`),
  updateContent: (id: string, data: any) => apiClient.put(`/content/${id}`, data),
  deleteContent: (id: string) => apiClient.delete(`/content/${id}`),
  publishContent: (id: string) => apiClient.post(`/content/${id}/publish`),

  // SEO
  auditWebsite: (data: any) => apiClient.post('/seo/audit', data),
  getAudits: (params?: any) => apiClient.get('/seo/audits', { params }),
  getAudit: (id: string) => apiClient.get(`/seo/audits/${id}`),
  findKeywords: (data: any) => apiClient.post('/seo/keywords', data),

  // Influencers
  searchInfluencers: (data: any) => apiClient.post('/influencers/search', data),
  getInfluencers: (params?: any) => apiClient.get('/influencers', { params }),
  getInfluencer: (id: string) => apiClient.get(`/influencers/${id}`),
  scoreInfluencer: (id: string, data: any) => apiClient.post(`/influencers/${id}/score`, data),
  updateCollaboration: (id: string, data: any) => apiClient.put(`/influencers/${id}/collaboration`, data),
  generateOutreach: (id: string, data: any) => apiClient.post(`/influencers/${id}/outreach`, data),

  // Analytics
  getDashboard: () => apiClient.get('/analytics/dashboard'),
  getPerformance: (params?: any) => apiClient.get('/analytics/performance', { params }),

  // AI Copilot
  chatCopilot: (data: any) => apiClient.post('/ai/chat', data),
};

export default apiClient;
