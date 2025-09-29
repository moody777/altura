import React from 'react';

interface Filters {
  sector: string;
  stage: string;
  hiringStatus: string;
  fundingNeeds: string;
  location: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sector
          </label>
          <select
            value={filters.sector}
            onChange={(e) => handleFilterChange('sector', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-sm"
          >
            <option value="all">All Sectors</option>
            <option value="AI/ML">AI/ML</option>
            <option value="FinTech">FinTech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="CleanTech">CleanTech</option>
            <option value="EdTech">EdTech</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <select
            value={filters.stage}
            onChange={(e) => handleFilterChange('stage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-sm"
          >
            <option value="all">All Stages</option>
            <option value="pre-seed">Pre-seed</option>
            <option value="seed">Seed</option>
            <option value="series-a">Series A</option>
            <option value="series-b">Series B</option>
            <option value="growth">Growth</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hiring Status
          </label>
          <select
            value={filters.hiringStatus}
            onChange={(e) => handleFilterChange('hiringStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-sm"
          >
            <option value="all">All Status</option>
            <option value="urgent">Urgent Hiring</option>
            <option value="open">Open Positions</option>
            <option value="not-hiring">Not Hiring</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funding Needs
          </label>
          <select
            value={filters.fundingNeeds}
            onChange={(e) => handleFilterChange('fundingNeeds', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-sm"
          >
            <option value="all">Any Amount</option>
            <option value="<100k">{"< $100k"}</option>
            <option value="100k-500k">$100k - $500k</option>
            <option value=">500k">{"> $500k"}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="City, Country"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onFiltersChange({
            sector: 'all',
            stage: 'all',
            hiringStatus: 'all',
            fundingNeeds: 'all',
            location: ''
          })}
          className="text-sm text-gray-600 hover:text-[#B8860B] transition-colors"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;