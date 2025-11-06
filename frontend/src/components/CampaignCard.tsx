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
      currency?: string;
    };
    performance: {
      impressions: number;
      clicks: number;
      ctr?: number;
    };
  };
  onClick?: () => void;
}

const statusColors = {
  draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  active: 'bg-green-500/20 text-green-300 border-green-500/30',
  paused: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const platformIcons: Record<string, string> = {
  facebook: '📘',
  instagram: '📸',
  linkedin: '💼',
  google: '🔍',
  youtube: '📺',
};

const platformGradients: Record<string, string> = {
  facebook: 'from-blue-500 to-blue-600',
  instagram: 'from-pink-500 to-purple-600',
  linkedin: 'from-blue-600 to-cyan-600',
  google: 'from-red-500 to-yellow-500',
  youtube: 'from-red-600 to-red-700',
};

export default function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const statusColor = statusColors[campaign.status as keyof typeof statusColors] || statusColors.draft;
  const icon = platformIcons[campaign.platform] || '📱';
  const gradient = platformGradients[campaign.platform] || 'from-gray-500 to-gray-600';
  
  // Safely calculate values with defaults
  const budgetSpent = campaign.budget?.spent || 0;
  const budgetTotal = campaign.budget?.total || 1;
  const budgetPercentage = Math.min((budgetSpent / budgetTotal) * 100, 100);
  const currency = campaign.budget?.currency || '$';
  
  // Calculate CTR if not provided
  const impressions = campaign.performance?.impressions || 0;
  const clicks = campaign.performance?.clicks || 0;
  const ctr = campaign.performance?.ctr || (impressions > 0 ? (clicks / impressions) * 100 : 0);

  return (
    <div
      onClick={onClick}
      className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer card-hover group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-400 capitalize">{campaign.objective}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColor}`}>
          {campaign.status}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Impressions</p>
          <p className="text-lg font-bold text-blue-400">
            {impressions.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Clicks</p>
          <p className="text-lg font-bold text-green-400">
            {clicks.toLocaleString()}
          </p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">CTR</p>
          <p className="text-lg font-bold text-purple-400">
            {ctr.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Budget */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">Budget Spent</p>
          <p className="text-sm font-medium text-white">
            {currency}{budgetSpent.toLocaleString()} / {currency}{budgetTotal.toLocaleString()}
          </p>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">{budgetPercentage.toFixed(0)}%</p>
      </div>
    </div>
  );
}
