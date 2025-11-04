interface CampaignCardProps {
  campaign: {
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
      ctr: number;
    };
  };
  onClick?: () => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-600',
};

const platformIcons: Record<string, string> = {
  facebook: '📘',
  instagram: '📸',
  linkedin: '💼',
  google: '🔍',
  youtube: '📺',
};

export default function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const statusColor = statusColors[campaign.status as keyof typeof statusColors] || statusColors.draft;
  const icon = platformIcons[campaign.platform] || '📱';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
          </div>
          <p className="text-sm text-gray-500 capitalize">{campaign.objective}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
          {campaign.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Impressions</p>
          <p className="text-lg font-semibold text-gray-900">
            {campaign.performance.impressions.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Clicks</p>
          <p className="text-lg font-semibold text-gray-900">
            {campaign.performance.clicks.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">CTR</p>
          <p className="text-lg font-semibold text-gray-900">
            {campaign.performance.ctr.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-medium text-gray-900">
              {campaign.budget.currency} {campaign.budget.spent.toLocaleString()} / {campaign.budget.total.toLocaleString()}
            </p>
          </div>
          <div className="w-24 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.min((campaign.budget.spent / campaign.budget.total) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
