import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData, Startup } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Heart, 
  MessageSquare, 
  MapPin, 
  Users, 
  DollarSign, 
  Briefcase,
  ExternalLink,
  UserPlus
} from 'lucide-react';

interface StartupCardProps {
  startup: Startup;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  const { user } = useAuth();
  const { likeStartup } = useData();
  const { addNotification } = useNotifications();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeStartup(startup.id);
    
    addNotification({
      type: 'success',
      title: 'Startup Liked',
      message: `You liked ${startup.name}!`
    });
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addNotification({
      type: 'success',
      title: 'Connection Request Sent',
      message: `Your connection request has been sent to ${startup.name}.`
    });
  };

  const getTypeColor = (type: string | undefined) => {
    if (!type) return 'bg-gray-800 text-gray-300 border border-gray-600';
    
    const colors = {
      'research': 'bg-blue-900/50 text-blue-300 border border-blue-700',
      'profit': 'bg-green-900/50 text-green-300 border border-green-700',
      'non-profit': 'bg-purple-900/50 text-purple-300 border border-purple-700',
      // Legacy support for old stage values
      'pre-seed': 'bg-gray-800 text-gray-300 border border-gray-600',
      'seed': 'bg-blue-900/50 text-blue-300 border border-blue-700',
      'series-a': 'bg-green-900/50 text-green-300 border border-green-700',
      'series-b': 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
      'growth': 'bg-purple-900/50 text-purple-300 border border-purple-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-800 text-gray-300 border border-gray-600';
  };

  const getHiringBadgeColor = (status: string) => {
    const colors = {
      'urgent': 'bg-red-900/50 text-red-300 border border-red-700',
      'open': 'bg-green-900/50 text-green-300 border border-green-700',
      'not-hiring': 'bg-gray-800 text-gray-400 border border-gray-600'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-800 text-gray-400 border border-gray-600';
  };

  const getHiringText = (status: string) => {
    const text = {
      'urgent': 'Urgent Hiring',
      'open': 'Hiring',
      'not-hiring': 'Not Hiring'
    };
    return text[status as keyof typeof text] || status;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:bg-gray-700/50 transition-all duration-300 group">
      <Link to={`/startup/${startup.id}`} className="block">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#C9A227] to-[#B8911F] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {startup.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white group-hover:text-[#B8860B] transition-colors">
                  {startup.name}
                </h3>
                <p className="text-sm text-gray-300">by {startup.founderId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {(startup.type || (startup as any).stage) && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(startup.type || (startup as any).stage)}`}>
                  {(startup.type || (startup as any).stage).charAt(0).toUpperCase() + (startup.type || (startup as any).stage).slice(1).replace('-', ' ')}
                </span>
              )}
              {startup.hiringStatus !== 'not-hiring' && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getHiringBadgeColor(startup.hiringStatus)}`}>
                  <Briefcase className="w-3 h-3 inline mr-1" />
                  {getHiringText(startup.hiringStatus)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {startup.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs border border-gray-600">
              {startup.sector}
            </span>
            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-xs border border-gray-600">
              {startup.type}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{startup.city}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{startup.teamSize} people</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>{startup.fundingNeeds.replace('-', ' - $')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{startup.likes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4" />
                <span>{startup.comments}</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors"
                  title="Visit website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              
              <button
                onClick={handleLike}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Like startup"
              >
                <Heart className="w-4 h-4" />
              </button>

              {user?.role !== 'startup' && (
                <button
                  onClick={handleConnect}
                  className="px-3 py-1 bg-[#B8860B] text-white text-sm rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-1"
                  title="Connect with founder"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Connect</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StartupCard;