import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  Building, 
  DollarSign, 
  Star,
  Eye,
  Send,
  Bookmark,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Target,
  Zap
} from 'lucide-react';

const MyJobs: React.FC = () => {
  const { jobApplications, jobRecommendations } = useData();
  const { addNotification } = useNotifications();
  
  // Use DataContext for applications and recommendations
  const applications = jobApplications;
  const recommendations = jobRecommendations;

  const [activeTab, setActiveTab] = useState<'applications' | 'recommendations'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'applied' | 'interview' | 'rejected'>('all');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleApplyJob = (_jobId: string) => {
    addNotification({
      type: 'success',
      title: 'Application Submitted',
      message: 'Your job application has been submitted successfully!'
    });
  };

  const handleSaveJob = (_jobId: string) => {
    addNotification({
      type: 'success',
      title: 'Job Saved',
      message: 'Job has been saved to your favorites.'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-900/50 text-blue-300 border-blue-700';
      case 'interview':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'rejected':
        return 'bg-red-900/50 text-red-300 border-red-700';
      case 'accepted':
        return 'bg-green-900/50 text-green-300 border-green-700';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <Send className="w-4 h-4" />;
      case 'interview':
        return <Calendar className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-900/50 text-red-300 border-red-700';
      case 'medium':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'low':
        return 'bg-green-900/50 text-green-300 border-green-700';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || rec.urgency === filterUrgency;
    return matchesSearch && matchesUrgency;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Job Applications</h1>
              <p className="text-gray-300">Track your applications and discover new opportunities</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Find Jobs</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Search & Filter</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search jobs..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    />
                  </div>
                </div>

                {activeTab === 'applications' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    >
                      <option value="all">All</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Urgency</label>
                    <select
                      value={filterUrgency}
                      onChange={(e) => setFilterUrgency(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    >
                      <option value="all">All</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Applications</span>
                  <span className="text-white font-semibold">{applications.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Interviews</span>
                  <span className="text-yellow-400 font-semibold">
                    {applications.filter(a => a.status === 'interview').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Recommendations</span>
                  <span className="text-green-400 font-semibold">{recommendations.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 mb-6">
              <div className="flex border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'applications'
                      ? 'text-[#B8860B] border-b-2 border-[#B8860B]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>My Applications</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'recommendations'
                      ? 'text-[#B8860B] border-b-2 border-[#B8860B]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Recommendations</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <div key={application.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-white">{application.jobTitle}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              <span className="capitalize">{application.status}</span>
                            </span>
                            <div className="flex items-center space-x-1 text-sm text-gray-400">
                              <Star className="w-4 h-4 text-[#B8860B]" />
                              <span>{application.matchScore}% match</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{application.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{application.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${application.salary.min.toLocaleString()} - ${application.salary.max.toLocaleString()}</span>
                            </div>
                            {application.remote && (
                              <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-700 text-xs">Remote</span>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm mb-3">{application.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {application.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs border border-gray-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>Applied on {new Date(application.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No applications found</h3>
                    <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
                    <button className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors">
                      Browse Jobs
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {filteredRecommendations.length > 0 ? (
                  filteredRecommendations.map((recommendation) => (
                    <div key={recommendation.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-white">{recommendation.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(recommendation.urgency)}`}>
                              {recommendation.urgency} priority
                            </span>
                            <div className="flex items-center space-x-1 text-sm text-gray-400">
                              <Zap className="w-4 h-4 text-[#B8860B]" />
                              <span>{recommendation.matchScore}% match</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{recommendation.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{recommendation.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>${recommendation.salary.min.toLocaleString()} - ${recommendation.salary.max.toLocaleString()}</span>
                            </div>
                            {recommendation.remote && (
                              <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-700 text-xs">Remote</span>
                            )}
                          </div>

                          <p className="text-gray-300 text-sm mb-3">{recommendation.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {recommendation.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs border border-gray-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Posted {new Date(recommendation.postedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleApplyJob(recommendation.id)}
                            className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Apply</span>
                          </button>
                          <button
                            onClick={() => handleSaveJob(recommendation.id)}
                            className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No recommendations found</h3>
                    <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
                    <button className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors">
                      Refresh Recommendations
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;