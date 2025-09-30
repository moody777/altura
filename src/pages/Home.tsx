import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import StartupCard from '../components/StartupCard';
import SearchFilters from '../components/SearchFilters';
import { Search, Filter } from 'lucide-react';

const Home: React.FC = () => {
  const { startups, searchStartups } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sector: 'all',
    stage: 'all',
    hiringStatus: 'all',
    fundingNeeds: 'all',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredStartups = useMemo(() => {
    return searchStartups(searchQuery, filters);
  }, [searchQuery, filters, searchStartups]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificCTA = () => {
    if (!user) {
      return 'Join the startup ecosystem and discover opportunities';
    }
    
    switch (user.role) {
      case 'investor':
        return 'Discover promising startups to invest in';
      case 'job_seeker':
        return 'Find your next exciting opportunity';
      case 'startup':
        return 'Connect with investors and talent';
      default:
        return 'Explore the startup ecosystem';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              {getGreeting()}{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {getRoleSpecificCTA()}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search startups, sectors, locations..."
                  className="w-full pl-12 pr-16 py-4 bg-gray-700/50 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-lg text-white placeholder-gray-400"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-[#B8860B] transition-colors"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              {/* Filter Toggle */}
              {showFilters && (
                <div className="mt-4">
                  <SearchFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery || Object.values(filters).some(f => f !== 'all' && f !== '') 
              ? `${filteredStartups.length} results found`
              : 'Discover Startups'
            }
          </h2>
          
          <div className="text-sm text-gray-400">
            Showing {filteredStartups.length} of {startups.length} startups
          </div>
        </div>

        {/* Startup Grid */}
        {filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No startups found</h3>
            <p className="text-gray-300 mb-4">
              Try adjusting your search terms or filters to find more results.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  sector: 'all',
                  stage: 'all',
                  hiringStatus: 'all',
                  fundingNeeds: 'all',
                  location: ''
                });
              }}
              className="text-[#B8860B] hover:text-[#A67C00] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;