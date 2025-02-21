import React, { useState, useMemo } from 'react';
import { PlugZap, SquareParking, Navigation, Clock, Star, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';

const StationList = ({ 
  stationsWithDistance = [], 
  parkingsWithDistance = [],
  onLocationSelect,
  selectedLocation
}) => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Combine and filter locations based on search and type
  const filteredLocations = useMemo(() => {
    const stations = stationsWithDistance.map(station => ({
      ...station,
      type: 'charging'
    }));
    
    const parkings = parkingsWithDistance.map(parking => ({
      ...parking,
      type: 'parking'
    }));

    let combined = [...stations, ...parkings];

    // Apply type filter
    if (filter !== 'all') {
      combined = combined.filter(location => location.type === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      combined = combined.filter(location => 
        location.name.toLowerCase().includes(query) ||
        location.vicinity?.toLowerCase().includes(query)
      );
    }

    // Sort by distance
    return combined.sort((a, b) => {
      const distA = parseFloat(a.distance?.replace('km', '').replace('m', '')) || 0;
      const distB = parseFloat(b.distance?.replace('km', '').replace('m', '')) || 0;
      return distA - distB;
    });
  }, [stationsWithDistance, parkingsWithDistance, filter, searchQuery]);

  const StatusBadge = ({ isOpen }) => (
    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
      isOpen 
        ? 'bg-emerald-500/20 text-emerald-300' 
        : 'bg-gray-500/20 text-gray-300'
    }`}>
      {isOpen ? "Open" : "Closed"}
    </span>
  );

  const RatingBadge = ({ rating }) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1 text-yellow-400">
        <Star size={16} className="fill-current" />
        <span>{rating}</span>
      </div>
    );
  };

  const FilterButton = ({ type, icon: Icon, label, current }) => (
    <button
      onClick={() => setFilter(type)}
      className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors
        ${current === type 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
    >
      <Icon size={16} />
      <span className="text-sm">{label}</span>
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Header */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Nearby Locations</h2>
          <div className="flex gap-2">
            <FilterButton type="all" icon={Filter} label="All" current={filter} />
            <FilterButton type="charging" icon={PlugZap} label="EV Stations" current={filter} />
            <FilterButton type="parking" icon={SquareParking} label="Parking" current={filter} />
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="space-y-3">
        {filteredLocations.map((location) => (
          <div
            key={location.place_id}
            className={`
              bg-gray-800/50 rounded-lg p-4 transition-all duration-300
              ${selectedLocation?.place_id === location.place_id 
                ? 'ring-2 ring-blue-500 ring-opacity-50' 
                : 'hover:bg-gray-700/50'
              }
            `}
          >
            <button
              onClick={() => {
                onLocationSelect(location);
                setExpandedId(expandedId === location.place_id ? null : location.place_id);
              }}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {location.type === 'charging' ? (
                    <PlugZap size={24} className="text-emerald-400" />
                  ) : (
                    <SquareParking size={24} className="text-blue-400" />
                  )}
                  <div>
                    <h3 className="font-medium text-white">{location.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Navigation size={14} />
                      <span>{location.distance}</span>
                      <RatingBadge rating={location.rating} />
                      <StatusBadge isOpen={location.opening_hours?.isOpen?.()} />
                    </div>
                  </div>
                </div>
                {expandedId === location.place_id ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </div>
            </button>

            {expandedId === location.place_id && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="space-y-2 text-sm text-gray-300">
                  {location.vicinity && (
                    <p className="flex items-start gap-2">
                      <span className="text-gray-400">Address:</span>
                      {location.vicinity}
                    </p>
                  )}
                  {location.opening_hours?.weekday_text && (
                    <div className="flex items-start gap-2">
                      <Clock size={16} className="text-gray-400 mt-1" />
                      <div>
                        {location.opening_hours.weekday_text.map((hours, idx) => (
                          <p key={idx} className="text-sm">{hours}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredLocations.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No locations found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default StationList;