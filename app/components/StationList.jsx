import React, { useState } from 'react';
import { PlugZap, SquareParking, Navigation, Star, Filter, MapPin } from 'lucide-react';

const StationList = ({
    stationsWithDistance = [],
    parkingsWithDistance = [],
    selectedLocation,
    setSelectedLocation,
    isLoading,
    handleMarkerClick
}) => {
    const [filter, setFilter] = useState('all');

    const getAllLocations = () => {
        const stations = stationsWithDistance.map(station => ({ ...station, type: 'charging' }));
        const parkings = parkingsWithDistance.map(parking => ({ ...parking, type: 'parking' }));
        return [...stations, ...parkings].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    };

    const filteredLocations = getAllLocations().filter(location => filter === 'all' || location.type === filter);

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        handleMarkerClick(location);
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-100">Nearby Locations</h2>
                <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
                    {['all', 'charging', 'parking'].map(type => (
                        <button key={type} onClick={() => setFilter(type)} className={`px-3 py-1.5 rounded-lg ${filter === type ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                            {type === 'charging' ? <PlugZap size={16} /> : type === 'parking' ? <SquareParking size={16} /> : <Filter size={16} />}
                            <span className="text-sm capitalize">{type}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-3">
                {filteredLocations.map(location => (
                    <div key={location.place_id} className={`bg-gray-800/40 rounded-xl transition-all ${selectedLocation?.place_id === location.place_id ? 'ring-1 ring-blue-400/50' : 'hover:bg-gray-700/40'}`}>
                        <button onClick={() => handleLocationClick(location)} className="w-full text-left p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-700/30 rounded-lg">
                                    {location.type === 'charging' ? <PlugZap size={20} className="text-emerald-400" /> : <SquareParking size={20} className="text-blue-400" />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-100">{location.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Navigation size={14} />
                                        <span>{location.distance}</span>
                                    </div>
                                    {location.rating && (
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star size={16} />
                                            <span>{location.rating}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {filteredLocations.length === 0 && (
                <div className="text-center py-8 text-gray-400">No locations found.</div>
            )}
        </div>
    );
};

export default StationList;
