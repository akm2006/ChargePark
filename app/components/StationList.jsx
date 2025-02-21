import React, { useState } from 'react';
import { PlugZap, SquareParking, Navigation, Clock, Star, ChevronDown, ChevronUp, Filter, MapPin } from 'lucide-react';

// Skeleton Loader Component
const SkeletonLocationCard = () => (
    <div className="animate-pulse bg-gray-800/70 rounded-lg overflow-hidden shadow-md p-4 mx-2 my-2 space-y-2 md:mx-4 lg:mx-6">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
    </div>
);


const StationList = ({
    stationsWithDistance = [],
    parkingsWithDistance = [],
    onLocationSelect,
    selectedLocation,
    isLoading
}) => {
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);


    // Combine and sort stations and parkings by distance
    const getAllLocations = () => {
        const stations = stationsWithDistance.map(station => ({
            ...station,
            ...station.opening_hours && { opening_hours: station.opening_hours },
            ...station.rating && { rating: station.rating },
            ...station.user_ratings_total && { user_ratings_total: station.user_ratings_total },
            ...station.vicinity && { vicinity: station.vicinity },
            ...station.name && { name: station.name },
            ...station.geometry && { geometry: station.geometry },
            ...station.place_id && { place_id: station.place_id },
            ...station.distance && { distance: station.distance },
            type: 'charging'
        }));

        const parkings = parkingsWithDistance.map(parking => ({
            ...parking,
            ...parking.opening_hours && { opening_hours: parking.opening_hours },
            ...parking.rating && { rating: parking.rating },
            ...parking.user_ratings_total && { user_ratings_total: parking.user_ratings_total },
            ...parking.vicinity && { vicinity: parking.vicinity },
            ...parking.name && { name: parking.name },
            ...parking.geometry && { geometry: parking.geometry },
            ...parking.place_id && { place_id: parking.place_id },
            ...parking.distance && { distance: parking.distance },
            type: 'parking'
        }));

        const combined = [...stations, ...parkings];
        return combined.sort((a, b) => {
            const distA = parseFloat(a.distance?.replace('km', '').replace('m', '')) || 0;
            const distB = parseFloat(b.distance?.replace('km', '').replace('m', '')) || 0;
            return distA - distB;
        });
    };

    const filteredLocations = getAllLocations().filter(location => {
        if (filter === 'all') return true;
        return location.type === filter;
    });


    const StatusBadge = ({ isOpen }) => (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isOpen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'
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
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${current === type ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
        >
            <Icon size={16} />
            <span className="text-sm">{label}</span>
        </button>
    );

    const handleOpenInGoogleMaps = (placeId) => {
        window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
    };

    if (isLoading) {
        return (
            <div className="space-y-3 p-4 mx-2 my-2 md:mx-4 lg:mx-6">
                {/* Display multiple skeleton cards with margin and padding */}
                {[...Array(6)].map((_, i) => (  // Display 6 skeleton cards
                    <SkeletonLocationCard key={i} />
                ))}
            </div>
        );
    }


    return (
      <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Nearby Locations</h2>
        <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
          <FilterButton type="all" icon={Filter} current={filter} />
          <FilterButton type="charging" icon={PlugZap} current={filter} />
          <FilterButton type="parking" icon={SquareParking} current={filter} />
        </div>
      </div>

      <div className="grid gap-3">
        {filteredLocations.map((location) => (
          <div
            key={location.place_id}
            className={`bg-gray-800/40 rounded-xl transition-all ${selectedLocation?.place_id === location.place_id 
              ? 'ring-1 ring-blue-400/50' 
              : 'hover:bg-gray-700/40'}`}
          >
            <button
              onClick={() => {
                onLocationSelect(location);
                setExpandedId(expandedId === location.place_id ? null : location.place_id);
              }}
              className="w-full text-left p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-700/30 rounded-lg">
                    {location.type === 'charging' ? (
                      <PlugZap size={20} className="text-emerald-400" />
                    ) : (
                      <SquareParking size={20} className="text-blue-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-100">{location.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Navigation size={14} />
                      <span>{location.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {location.rating && <RatingBadge rating={location.rating} />}
                      {location.opening_hours && (
                        <StatusBadge isOpen={location.opening_hours?.isOpen?.()} />
                      )}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform ${expandedId === location.place_id ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {expandedId === location.place_id && (
              <div className="px-4 pb-4 space-y-3">
                {location.vicinity && (
                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <MapPin size={14} className="mt-0.5 text-gray-400" />
                    <p className="leading-snug">{location.vicinity}</p>
                  </div>
                )}
                <button
                  onClick={() => handleOpenInGoogleMaps(location.place_id)}
                  className="w-full flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  <span>Open in Maps</span>
                  <Navigation size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

            {filteredLocations.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    No locations found. Try adjusting your filters or search area.
                </div>
            )}
        </div>
    );
};

export default StationList;