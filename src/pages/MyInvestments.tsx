import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Building, 
  Star,
  Eye,
  MessageCircle,
  Plus,
  Target,
  Award,
  Calendar,
  Users,
  BarChart3,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Globe,
  Briefcase,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const MyInvestments: React.FC = () => {
  const { user } = useAuth();
  const { startups, createConnection, investments, investmentOpportunities } = useData();
  const { addNotification } = useNotifications();
  

  const [activeTab, setActiveTab] = useState<'portfolio' | 'opportunities'>('portfolio');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<'all' | 'pre-seed' | 'seed' | 'series-a' | 'series-b'>('all');
  const [filterSector, setFilterSector] = useState<'all' | 'AI/ML' | 'CleanTech' | 'HealthTech' | 'FinTech'>('all');

  const handleConnect = (startupId: string, startupName: string) => {
    createConnection(startupId, `Hi! I'm interested in learning more about ${startupName} for potential investment.`);
    
    addNotification({
      type: 'success',
      title: 'Connection Request Sent',
      message: `Your connection request has been sent to ${startupName}.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/50 text-green-300 border-green-700';
      case 'exited':
        return 'bg-blue-900/50 text-blue-300 border-blue-700';
      case 'written-off':
        return 'bg-red-900/50 text-red-300 border-red-700';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getReturnColor = (returnValue: number) => {
    if (returnValue > 0) return 'text-green-400';
    if (returnValue < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getReturnIcon = (returnValue: number) => {
    if (returnValue > 0) return <TrendingUpIcon className="w-4 h-4" />;
    if (returnValue < 0) return <TrendingDown className="w-4 h-4" />;
    return <BarChart3 className="w-4 h-4" />;
  };

  const filteredInvestments = investments.filter(inv => {
    const matchesSearch = inv.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'all' || inv.stage === filterStage;
    const matchesSector = filterSector === 'all' || inv.sector === filterSector;
    return matchesSearch && matchesStage && matchesSector;
  });

  const filteredOpportunities = investmentOpportunities.filter(opp => {
    const matchesSearch = opp.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'all' || opp.stage === filterStage;
    const matchesSector = filterSector === 'all' || opp.sector === filterSector;
    return matchesSearch && matchesStage && matchesSector;
  });

  const totalInvested = investments.reduce((sum, inv) => sum + inv.investmentAmount, 0);
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturn = ((totalValue - totalInvested) / totalInvested) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Investment Portfolio</h1>
              <p className="text-gray-300">Manage your investments and discover new opportunities</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Find Opportunities</span>
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
                      placeholder="Search investments..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stage</label>
                  <select
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  >
                    <option value="all">All Stages</option>
                    <option value="pre-seed">Pre-seed</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sector</label>
                  <select
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  >
                    <option value="all">All Sectors</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="CleanTech">CleanTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="FinTech">FinTech</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Portfolio Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Invested</span>
                  <span className="text-white font-semibold">${totalInvested.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Value</span>
                  <span className="text-white font-semibold">${totalValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Return</span>
                  <span className={`font-semibold flex items-center space-x-1 ${getReturnColor(totalReturn)}`}>
                    {getReturnIcon(totalReturn)}
                    <span>{totalReturn.toFixed(1)}%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Investments</span>
                  <span className="text-white font-semibold">{investments.length}</span>
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
                  onClick={() => setActiveTab('portfolio')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'portfolio'
                      ? 'text-[#B8860B] border-b-2 border-[#B8860B]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>My Portfolio</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'opportunities'
                      ? 'text-[#B8860B] border-b-2 border-[#B8860B]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Opportunities</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {filteredInvestments.length > 0 ? (
                  filteredInvestments.map((investment) => (
                    <div key={investment.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-white">{investment.startupName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(investment.status)}`}>
                              {investment.status}
                            </span>
                            <div className="flex items-center space-x-1 text-sm">
                              <span className={`flex items-center space-x-1 ${getReturnColor(investment.return)}`}>
                                {getReturnIcon(investment.return)}
                                <span>{investment.return}%</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-gray-400 text-sm">Investment</p>
                              <p className="text-white font-semibold">${investment.investmentAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Current Value</p>
                              <p className="text-white font-semibold">${investment.currentValue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Equity</p>
                              <p className="text-white font-semibold">{investment.equity}%</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Stage</p>
                              <p className="text-white font-semibold capitalize">{investment.stage.replace('-', ' ')}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{investment.sector}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{investment.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(investment.date).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <p className="text-gray-300 text-sm mb-3">{investment.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {investment.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs border border-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-[#B8860B] transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No investments found</h3>
                    <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
                    <button className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors">
                      Explore Opportunities
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                {filteredOpportunities.length > 0 ? (
                  filteredOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#B8860B] to-[#A67C00] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                              {opportunity.avatar}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{opportunity.startupName}</h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-400">{opportunity.sector}</span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-400 capitalize">{opportunity.stage.replace('-', ' ')}</span>
                                <div className="flex items-center space-x-1">
                                  <Award className="w-4 h-4 text-[#B8860B]" />
                                  <span className="text-sm text-[#B8860B] font-medium">{opportunity.matchScore}% match</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-gray-400 text-sm">Funding Target</p>
                              <p className="text-white font-semibold">${opportunity.fundingTarget.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Raised</p>
                              <p className="text-white font-semibold">${opportunity.raised.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Days Left</p>
                              <p className="text-white font-semibold">{opportunity.daysLeft}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Team Size</p>
                              <p className="text-white font-semibold">{opportunity.teamSize}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{opportunity.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="w-4 h-4" />
                              <span>{opportunity.revenue}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{opportunity.daysLeft} days left</span>
                            </div>
                          </div>

                          <p className="text-gray-300 text-sm mb-3">{opportunity.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {opportunity.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs border border-gray-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                              <span>Funding Progress</span>
                              <span>{Math.round((opportunity.raised / opportunity.fundingTarget) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-[#B8860B] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(opportunity.raised / opportunity.fundingTarget) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleConnect(opportunity.id, opportunity.startupName)}
                            className="bg-[#B8860B] text-white px-4 py-2 rounded-lg hover:bg-[#A67C00] transition-colors flex items-center space-x-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Connect</span>
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
                    <h3 className="text-lg font-semibold text-white mb-2">No opportunities found</h3>
                    <p className="text-gray-400 mb-4">Try adjusting your search or filters.</p>
                    <button className="bg-[#B8860B] text-white px-6 py-3 rounded-lg hover:bg-[#A67C00] transition-colors">
                      Refresh Opportunities
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

export default MyInvestments;