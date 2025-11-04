import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Campaign {
  _id: string;
  name: string;
  objective: string;
  platform: string;
  status: string;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
}

interface CampaignStore {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (campaign: Campaign | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set) => ({
      campaigns: [],
      selectedCampaign: null,
      loading: false,
      error: null,

      setCampaigns: (campaigns) => set({ campaigns }),
      
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [campaign, ...state.campaigns] })),
      
      updateCampaign: (id, data) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c._id === id ? { ...c, ...data } : c
          ),
          selectedCampaign:
            state.selectedCampaign?._id === id
              ? { ...state.selectedCampaign, ...data }
              : state.selectedCampaign,
        })),
      
      deleteCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c._id !== id),
          selectedCampaign:
            state.selectedCampaign?._id === id ? null : state.selectedCampaign,
        })),
      
      selectCampaign: (campaign) => set({ selectedCampaign: campaign }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
    }),
    {
      name: 'campaign-storage',
      partialize: (state) => ({ campaigns: state.campaigns }),
    }
  )
);
