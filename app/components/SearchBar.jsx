import { Search, LocateFixed } from 'lucide-react';
import {useState} from 'react';
import { Combobox } from '@headlessui/react';

const SearchBar = ({ setUserLocation, setIsLoading }) => {
    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState([]);

    const handleSearch = (input) => {
        setQuery(input);
        if (!input || !window.google) return;

        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions(
            {
                input,
                componentRestrictions: { country: 'IN' },
                types: ['geocode', 'establishment'],
            },
            (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    setPredictions(results);
                }
            }
        );
    };

    const handleSelect = async (place) => {
        setIsLoading(true);
        const geocoder = new window.google.maps.Geocoder();

        try {
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ placeId: place.place_id }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results[0]);
                    } else {
                        reject(status);
                    }
                });
            });

            const { lat, lng } = result.geometry.location;
            setUserLocation({ lat: lat(), lng: lng() });
            setQuery(place.description);
            setPredictions([]);
        } catch (error) {
            console.error('Geocoding error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Handle Current Location
    const handleCurrentLocation = () => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsLoading(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="w-full max-w-md mx-auto mb-4 relative">
            <Combobox onChange={handleSelect}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <Combobox.Input
                        className="w-full py-2 pl-10 pr-12 text-sm text-gray-900 bg-white border rounded-full border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search for a location..."
                        onChange={(event) => handleSearch(event.target.value)}
                        value={query}
                    />
                    {/* ✅ Current Location Button */}
                    <button
                        type="button"
                        onClick={handleCurrentLocation}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-500"
                    >
                        <LocateFixed className="h-5 w-5" />
                    </button>
                    <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {predictions.map((prediction) => (
                            <Combobox.Option
                                key={prediction.place_id}
                                value={prediction}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                    }`
                                }
                            >
                                {prediction.description}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </div>
            </Combobox>
        </div>
    );
};

export { SearchBar };
