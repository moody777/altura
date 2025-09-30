import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  DollarSign, 
  Globe, 
  Heart, 
  MessageSquare,
  UserPlus,
  Briefcase,
  ExternalLink,
  Send,
  ThumbsUp,
  Calendar,
  Building
} from 'lucide-react';

const StartupDetail: React.FC = () => {
  const { id } = useParams();
  const { startups, jobs, likeStartup, comments, addComment, likeComment } = useData();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const startup = startups.find(s => s.id === id);
  const startupJobs = jobs.filter(j => j.startupId === id);
  
  
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(startup?.likes || 0);

  const handleLike = () => {
    if (startup) {
      likeStartup(startup.id);
      setIsLiked(!isLiked);
      setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
      
      addNotification({
        type: 'success',
        title: isLiked ? 'Startup Unliked' : 'Startup Liked',
        message: `You ${isLiked ? 'unliked' : 'liked'} ${startup.name}!`
      });
    }
  };

  const handleConnect = () => {
    if (startup) {
      addNotification({
        type: 'success',
        title: 'Connection Request Sent',
        message: `Your connection request has been sent to ${startup.name}.`
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user && startup) {
      addComment(startup.id, newComment.trim());
      setNewComment('');
      
      addNotification({
        type: 'success',
        title: 'Comment Added',
        message: 'Your comment has been posted successfully!'
      });
    }
  };

  const handleCommentLike = (commentId: number) => {
    likeComment(commentId);
  };

  if (!startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Startup not found</h2>
          <p className="text-gray-300 mb-4">The startup you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="text-[#B8860B] hover:text-[#A67C00] transition-colors"
          >
            Back to explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to explore</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                      {startup.name.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">{startup.name}</h1>
                      <p className="text-lg text-gray-300">Founded by {startup.founderId}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700">
                          {startup.type.charAt(0).toUpperCase() + startup.type.slice(1).replace('-', ' ')}
                        </span>
                        <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm font-medium border border-green-700">
                          {startup.sector}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-gray-300 mb-4">
                      <button
                        onClick={handleLike}
                        className={`flex items-center space-x-1 transition-colors ${
                          isLiked ? 'text-red-400' : 'text-gray-300 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{localLikes}</span>
                      </button>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{comments.length}</span>
                      </span>
                    </div>
                    
                    {user?.role !== 'startup' && (
                      <button 
                        onClick={handleConnect}
                        className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Connect with Founder</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-3">About</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {startup.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <MapPin className="w-6 h-6 text-[#B8860B] mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Location</div>
                    <div className="font-semibold text-white">{startup.city}</div>
                    <div className="text-sm text-gray-400">{startup.country}</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <Users className="w-6 h-6 text-[#B8860B] mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Team Size</div>
                    <div className="font-semibold text-white">{startup.teamSize}</div>
                    <div className="text-sm text-gray-400">employees</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <DollarSign className="w-6 h-6 text-[#B8860B] mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Funding Needs</div>
                    <div className="font-semibold text-white">{startup.fundingNeeds}</div>
                    <div className="text-sm text-gray-400">target</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                    <Briefcase className="w-6 h-6 text-[#B8860B] mx-auto mb-2" />
                    <div className="text-sm text-gray-400">Hiring Status</div>
                    <div className="font-semibold text-white capitalize">
                      {startup.hiringStatus.replace('-', ' ')}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600">
                      {startup.sector}
                    </span>
                    <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600">
                      {startup.type}
                    </span>
                  </div>
                </div>

                {/* Website */}
                {startup.website && (
                  <div className="border-t border-gray-600 pt-6">
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-[#B8860B] hover:text-[#A67C00] transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Open Positions */}
            {startupJobs.length > 0 && (
              <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
                  
                  <div className="space-y-4">
                    {startupJobs.map((job) => (
                      <div key={job.id} className="border border-gray-600 rounded-lg p-6 hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-300">
                              <span>${job.salary.min.toLocaleString()}{job.salary.max && job.salary.max > 0 ? ` - $${job.salary.max.toLocaleString()}` : ''}</span>
                              {job.equity && <span>{job.equity} equity</span>}
                              <span>{job.city}, {job.country}</span>
                              <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-700">{(job as any).workMode || 'On-Site'}</span>
                            </div>
                          </div>
                          
                          {user?.role === 'job_seeker' && (
                            <button className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors">
                              Apply
                            </button>
                          )}
                        </div>
                        
                        <p className="text-gray-300 mb-4">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs border border-gray-600">
                            Skills will be extracted from description
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h2>
                
                {/* Add Comment Form */}
                {user && (
                  <form onSubmit={handleAddComment} className="mb-8">
                    <div className="flex space-x-4">
                      <div className="w-10 h-10 bg-[#B8860B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your thoughts about this startup..."
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold text-sm">
                        {comment.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-white">{comment.user}</h4>
                          <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-300 mb-3">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-[#B8860B] transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="text-gray-400 hover:text-[#B8860B] transition-colors text-sm">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Founder Info */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Founder</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#B8860B] rounded-full flex items-center justify-center text-white font-bold">
                  {startup.founderId.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{startup.founderId}</h4>
                  <p className="text-gray-400 text-sm">Founder & CEO</p>
                </div>
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Company Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Founded</span>
                  <span className="text-white font-semibold">2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white font-semibold capitalize">{startup.type.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Team Size</span>
                  <span className="text-white font-semibold">{startup.teamSize} people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Location</span>
                  <span className="text-white font-semibold">{startup.city}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-[#B8860B] text-white py-2 px-4 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center justify-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Save Startup</span>
                </button>
                <button className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Share</span>
                </button>
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;