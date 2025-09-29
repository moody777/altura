import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign, 
  MapPin, 
  Globe, 
  Briefcase,
  TrendingUp,
  MessageCircle,
  Eye,
  Save,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

const MyStartup: React.FC = () => {
  const { user } = useAuth();
  const { startups, jobs, createJob, applications, updateApplicationStatus } = useData();
  const { addNotification } = useNotifications();
  
  // Find user's startup
  const userStartup = startups.find(s => s.founderId === user?.id);
  
  // State for forms and modals
  const [showJobForm, setShowJobForm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [showJobApplications, setShowJobApplications] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI startup assistant. I can help you with business strategy, hiring advice, funding guidance, and more. How can I assist you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    salary: { min: 0, max: 0, currency: 'EGP' },
    equity: '',
    location: '',
    workMode: 'on-site' as 'on-site' | 'remote' | 'hybrid',
    skills: [] as string[]
  });
  const [editedStartup, setEditedStartup] = useState({
    name: userStartup?.name || '',
    description: userStartup?.description || '',
    website: userStartup?.website || '',
    type: userStartup?.type || '',
    sector: userStartup?.sector || '',
    teamSize: userStartup?.teamSize || '',
    fundingNeeds: userStartup?.fundingNeeds || '',
    hiringStatus: userStartup?.hiringStatus || ''
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!newJob.title.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Job title is required.'
      });
      return;
    }
    
    if (!newJob.description.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Job description is required.'
      });
      return;
    }
    
    if (!newJob.location.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Job location is required.'
      });
      return;
    }
    
    if (newJob.salary.min <= 0) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid minimum salary.'
      });
      return;
    }
    
    if (newJob.salary.max > 0 && newJob.salary.min > newJob.salary.max) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Minimum salary cannot be greater than maximum salary.'
      });
      return;
    }
    
    if (userStartup) {
      createJob({
        ...newJob,
        startupId: userStartup.id
      } as any);
      
      addNotification({
        type: 'success',
        title: 'Job Posted',
        message: 'Your job posting has been created successfully!'
      });
      
      setNewJob({
        title: '',
        description: '',
        salary: { min: 0, max: 0, currency: 'EGP' },
        equity: '',
        location: '',
        workMode: 'on-site',
        skills: []
      });
      setShowJobForm(false);
    }
  };



  const handleSaveProfile = () => {
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your startup profile has been updated successfully!'
    });
    setShowEditProfile(false);
  };

  const handleEditJob = (job: any) => {
    setNewJob({
      title: job.title,
      description: job.description,
      salary: job.salary,
      equity: job.equity || '',
      location: job.location,
      workMode: job.workMode || 'on-site',
      skills: job.skills || []
    });
    setShowEditJob(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      // In a real app, you would call a delete function from the context
      console.log('Deleting job:', jobId);
      addNotification({
        type: 'success',
        title: 'Job Deleted',
        message: 'The job posting has been deleted successfully!'
      });
    }
  };

  const handleViewApplications = (job: any) => {
    setSelectedJob(job);
    setShowJobApplications(true);
  };

  const handleUpdateApplicationStatus = (applicationId: string, newStatus: string) => {
    updateApplicationStatus(applicationId, newStatus as any);
    
    addNotification({
      type: 'success',
      title: 'Status Updated',
      message: `Application status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`
    });
  };

  const handleUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation (same as create job)
    if (!newJob.title.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Job title is required.'
      });
      return;
    }
    
    if (!newJob.description.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Job description is required.'
      });
      return;
    }
    
    if (!newJob.location.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Job location is required.'
      });
      return;
    }
    
    if (newJob.salary.min <= 0) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid minimum salary.'
      });
      return;
    }
    
    if (newJob.salary.max > 0 && newJob.salary.min > newJob.salary.max) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Minimum salary cannot be greater than maximum salary.'
      });
      return;
    }

    // In a real app, you would call an update function from the context
    addNotification({
      type: 'success',
      title: 'Job Updated',
      message: 'Your job posting has been updated successfully!'
    });
    
    setNewJob({
      title: '',
      description: '',
      salary: { min: 0, max: 0, currency: 'EGP' },
      equity: '',
      location: '',
      workMode: 'on-site',
      skills: []
    });
    setShowEditJob(false);
  };

  const startupJobs = jobs.filter(j => j.startupId === userStartup?.id);

  // Chat functions
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Based on your startup's current stage, I'd recommend focusing on customer validation first. Have you conducted any user interviews?",
        "For hiring, I suggest creating a clear job description with specific skills and cultural fit requirements. What role are you looking to fill?",
        "Regarding funding, your startup seems to be in a good position. Consider preparing a pitch deck with clear metrics and growth projections.",
        "I can help you analyze your business model. What's your primary revenue stream, and how do you plan to scale it?",
        "For marketing strategy, I'd recommend starting with content marketing and social media presence. What's your target audience?",
        "That's an interesting challenge. Let me help you think through this systematically. What specific aspect would you like to focus on first?",
        "Based on your startup's sector, I suggest looking into industry-specific accelerators and networking events. Have you considered joining any startup communities?",
        "For product development, I recommend following the lean startup methodology. What's your current MVP status?",
        "Great point! Let me help you develop a strategy for that. What resources do you currently have available?",
        "I understand your concern. Many startups face similar challenges. Let's break this down into actionable steps. What's your biggest priority right now?"
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: randomResponse,
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (showChat) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  if (!userStartup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Building className="w-16 h-16 text-[#B8860B] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Startup Found</h2>
          <p className="text-gray-300 mb-4">
            You don't have a startup profile yet. Complete your onboarding to create one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                {userStartup.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{userStartup.name}</h1>
                <p className="text-gray-300">Your startup dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Open Positions</p>
                    <p className="text-2xl font-bold text-white">{startupJobs.length}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-[#B8860B]" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Team Size</p>
                    <p className="text-2xl font-bold text-white">{userStartup.teamSize}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#B8860B]" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Funding Target</p>
                    <p className="text-2xl font-bold text-white">{userStartup.fundingNeeds}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#B8860B]" />
                </div>
              </div>
            </div>


            {/* Job Management */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Job Postings</h2>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Job</span>
                </button>
              </div>

              {startupJobs.length > 0 ? (
                <div className="space-y-4">
                  {startupJobs.map((job) => (
                    <div key={job.id} className="border border-gray-600 rounded-lg p-6 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                            <span>
                              ${job.salary.min.toLocaleString()}
                              {job.salary.max > 0 && ` - $${job.salary.max.toLocaleString()}`}
                            </span>
                            {job.equity && <span>{job.equity} equity</span>}
                            <span>{job.location}</span>
                            <span className={`px-2 py-1 rounded border ${
                              (job as any).workMode === 'remote' ? 'bg-green-900/50 text-green-300 border-green-700' :
                              (job as any).workMode === 'hybrid' ? 'bg-blue-900/50 text-blue-300 border-blue-700' :
                              'bg-gray-800 text-gray-300 border-gray-600'
                            }`}>
                              {(job as any).workMode === 'on-site' ? 'On-Site' : 
                               (job as any).workMode === 'remote' ? 'Remote' : 'Hybrid'}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">{job.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs border border-gray-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button 
                            onClick={() => handleViewApplications(job)}
                            className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors"
                            title="View Applications"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditJob(job)}
                            className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No job postings yet</h3>
                  <p className="text-gray-400 mb-4">Create your first job posting to start attracting talent.</p>
                  <button
                    onClick={() => setShowJobForm(true)}
                    className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Startup Info */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Startup Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{userStartup.location.city}, {userStartup.location.country}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 capitalize">{userStartup.type.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{userStartup.sector}</span>
                </div>
                {userStartup.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a 
                      href={userStartup.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#B8860B] hover:text-[#A67C00] transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowJobForm(true)}
                  className="w-full bg-[#B8860B] text-white py-2 px-4 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Job</span>
                </button>
                <button 
                  onClick={toggleChat}
                  className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>AI Assistant</span>
                </button>
                <button className="w-full border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>View Messages</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Post New Job</h2>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  rows={4}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                      value={newJob.salary.min || ''}
                    onChange={(e) => setNewJob(prev => ({ ...prev, salary: { ...prev.salary, min: parseInt(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="80000"
                      min="0"
                  />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Salary (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                      value={newJob.salary.max || ''}
                    onChange={(e) => setNewJob(prev => ({ ...prev, salary: { ...prev.salary, max: parseInt(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                      placeholder="Optional"
                      min="0"
                  />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Mode</label>
                  <select
                    value={newJob.workMode}
                    onChange={(e) => setNewJob(prev => ({ ...prev, workMode: e.target.value as 'on-site' | 'remote' | 'hybrid' }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  >
                    <option value="on-site">On-Site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Equity (Optional)</label>
                  <input
                    type="text"
                    value={newJob.equity}
                    onChange={(e) => setNewJob(prev => ({ ...prev, equity: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="Optional - e.g. 0.1% - 0.5%"
                  />
                </div>
              </div>



              <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                  onClick={() => setShowJobForm(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                  Cancel
                  </button>
                      <button
                  type="submit"
                  className="bg-[#B8860B] text-white px-6 py-2 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                      >
                  <Save className="w-4 h-4" />
                  <span>Post Job</span>
                      </button>
                </div>
            </form>
              </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Edit Job Posting</h2>
            </div>
            <form onSubmit={handleUpdateJob} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="e.g. Cairo, Egypt"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  rows={4}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={newJob.salary.min || ''}
                      onChange={(e) => setNewJob(prev => ({ ...prev, salary: { ...prev.salary, min: parseInt(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                      placeholder="80000"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Salary (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={newJob.salary.max || ''}
                      onChange={(e) => setNewJob(prev => ({ ...prev, salary: { ...prev.salary, max: parseInt(e.target.value) || 0 } }))}
                      className="w-full pl-8 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                      placeholder="Optional"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Mode</label>
                  <select
                    value={newJob.workMode}
                    onChange={(e) => setNewJob(prev => ({ ...prev, workMode: e.target.value as 'on-site' | 'remote' | 'hybrid' }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  >
                    <option value="on-site">On-Site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Equity (Optional)</label>
                  <input
                    type="text"
                    value={newJob.equity}
                    onChange={(e) => setNewJob(prev => ({ ...prev, equity: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="Optional - e.g. 0.1% - 0.5%"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditJob(false);
                    setNewJob({
                      title: '',
                      description: '',
                      salary: { min: 0, max: 0, currency: 'EGP' },
                      equity: '',
                      location: '',
                      workMode: 'on-site',
                      skills: []
                    });
                  }}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#B8860B] text-white px-6 py-2 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Job</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Applications Modal */}
      {showJobApplications && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Applications for {selectedJob.title}</h2>
                <button
                  onClick={() => setShowJobApplications(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Applications data */}
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border border-gray-600 rounded-lg p-6 hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-lg flex items-center justify-center text-white font-bold">
                            {application.applicantName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{application.applicantName}</h3>
                            <p className="text-gray-300 text-sm">{application.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <span className="text-gray-400 text-sm">Experience</span>
                            <p className="text-white font-medium">{application.experience}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Applied</span>
                            <p className="text-white font-medium">{new Date(application.appliedDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              application.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' :
                              application.status === 'reviewed' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                              application.status === 'interviewed' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                              'bg-gray-800 text-gray-300 border border-gray-600'
                            }`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-gray-400 text-sm">Skills</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {application.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs border border-gray-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-gray-400 text-sm">Cover Letter</span>
                          <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                            {application.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <a
                            href={`#${application.resume}`}
                            className="text-[#B8860B] hover:text-[#A67C00] transition-colors text-sm font-medium"
                          >
                            📄 View Resume
                          </a>
                          <button className="text-[#B8860B] hover:text-[#A67C00] transition-colors text-sm font-medium">
                            💬 Contact
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <select
                          value={application.status}
                          onChange={(e) => {
                            handleUpdateApplicationStatus(application.id, e.target.value);
                          }}
                          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="interviewed">Interviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {applications.length === 0 && (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No applications yet</h3>
                  <p className="text-gray-400">Applications will appear here when candidates apply for this position.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Edit Startup Profile</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Business Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={editedStartup.name}
                    onChange={(e) => setEditedStartup(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                      placeholder="Acme Inc."
                    required
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
                    <select
                      value={editedStartup.sector}
                      onChange={(e) => setEditedStartup(prev => ({ ...prev, sector: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    >
                      <option value="">Select sector</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="FinTech">FinTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="CleanTech">CleanTech</option>
                      <option value="EdTech">EdTech</option>
                    </select>
                </div>
              </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Description</label>
                <textarea
                    rows={4}
                  value={editedStartup.description}
                  onChange={(e) => setEditedStartup(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="Describe your startup..."
                  required
                />
              </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website (Optional)</label>
                  <input
                    type="url"
                    value={editedStartup.website}
                    onChange={(e) => setEditedStartup(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    placeholder="https://yourstartup.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={editedStartup.type}
                      onChange={(e) => setEditedStartup(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="research">Research</option>
                      <option value="profit">Profit</option>
                      <option value="non-profit">Non-Profit</option>
                    </select>
                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                    <select
                      value={editedStartup.teamSize}
                      onChange={(e) => setEditedStartup(prev => ({ ...prev, teamSize: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      <option value="1-2">1-2</option>
                      <option value="2-5">2-5</option>
                      <option value="5-10">5-10</option>
                      <option value="10-20">10-20</option>
                      <option value="20-50">20-50</option>
                      <option value="50+">50+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Funding Needs</label>
                    <select
                      value={editedStartup.fundingNeeds}
                      onChange={(e) => setEditedStartup(prev => ({ ...prev, fundingNeeds: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    >
                      <option value="">Select amount</option>
                      <option value="<100k">{"< $100k"}</option>
                      <option value="100k-500k">$100k - $500k</option>
                      <option value=">500k">{"> $500k"}</option>
                    </select>
                </div>
              </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hiring Status</label>
                  <select
                    value={editedStartup.hiringStatus}
                    onChange={(e) => setEditedStartup(prev => ({ ...prev, hiringStatus: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="urgent">Urgent hiring</option>
                    <option value="open">Open positions</option>
                    <option value="not-hiring">Not hiring</option>
                  </select>
                </div>
              </div>


              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="bg-[#B8860B] text-white px-6 py-2 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Toggle Button */}
        {!showChat && (
          <button
            onClick={toggleChat}
            className="bg-[#B8860B] hover:bg-[#A67C00] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <Bot className="w-6 h-6" />
          </button>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
          }`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-gray-400 text-xs">Startup Advisor</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[350px]">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-[#B8860B] text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-gray-100 p-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask me anything about your startup..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-sm"
                      disabled={isTyping}
                    />
                    <button
                      type="submit"
                      disabled={!currentMessage.trim() || isTyping}
                      className="bg-[#B8860B] hover:bg-[#A67C00] disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStartup;