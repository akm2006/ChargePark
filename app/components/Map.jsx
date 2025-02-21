"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { LoaderPinwheel, PlugZap, SquareParking, Locate } from "lucide-react";

const defaultMapContainerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "1rem",
  position: "relative", // Add relative positioning
};

const defaultMapZoom = 14;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  backgroundColor: "rgba(0, 0, 0, 0)",
  fullscreenControl: true, // Enable the fullscreen control
};

const fallbackLocation = { lat: 22.5950, lng: 88.4790 };

const MapComponent = () => {
  const [evStations, setEvStations] = useState([]);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [evMarkerIcon, setEvMarkerIcon] = useState(null);
  const [parkingMarkerIcon, setParkingMarkerIcon] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stationsWithDistance, setStationsWithDistance] = useState([]);
  const [parkingsWithDistance, setParkingsWithDistance] = useState([]);
  const [radius, setRadius] = useState(1500);  // Reduced radius
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [map, setMap] = useState(null);

  const locate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoading(false);
          map?.panTo({ lat: latitude, lng: longitude }); // Use panTo to smoothly move the map
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserLocation(fallbackLocation);
          setIsLoading(false);
        }
      );
    } else {
      setUserLocation(fallbackLocation);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    locate(); // Initial location fetch on component mount
  }, []);

  const fetchPlaces = useCallback((map, keyword, setState) => {
    if (!window.google) return;
    setIsMapLoaded(true);

    setEvMarkerIcon({
      url: "/ev-marker.png",
      scaledSize: new window.google.maps.Size(30, 30),
    });

    setParkingMarkerIcon({
      url: "/parking-marker.png",
      scaledSize: new window.google.maps.Size(30, 30),
    });

    const service = new google.maps.places.PlacesService(map);

    const request = {
      location: userLocation,
      radius: radius,
      keyword: keyword,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setState(results);
      } else {
        if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log(`No ${keyword} found nearby.`);
          setState([]); // Set state to empty array to clear previous results
        } else {
          console.error(`Error fetching ${keyword}:`, status);
        }
      }
    });
  }, [radius, userLocation]);

  const calculateDistance = useCallback((destination) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !userLocation) {
        reject("Google Maps API not loaded or user location not available.");
        return;
      }

      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [userLocation],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            const distanceText = response.rows[0].elements[0].distance.text;
            resolve(distanceText);
          } else {
            console.error("Error calculating distance:", status);
            reject(status);
          }
        }
      );
    });
  }, [userLocation]);

  useEffect(() => {
    const addDistances = async () => {
      if (stationsWithDistance.length > 0 && userLocation) {
        const updatedStations = await Promise.all(
          stationsWithDistance.map(async (station) => {
            try {
              const distance = await calculateDistance(station.geometry.location);
              return { ...station, distance };
            } catch (error) {
              console.error("Failed to calculate distance for station:", station.name, error);
              return { ...station, distance: "N/A" };
            }
          })
        );
        setStationsWithDistance(updatedStations);
      }
    };

    addDistances();
  }, [stationsWithDistance, userLocation, calculateDistance]);

  useEffect(() => {
    const addParkingsDistance = async () => {
      if (parkingsWithDistance.length > 0 && userLocation) {
        const updatedParkings = await Promise.all(
          parkingsWithDistance.map(async (parking) => {
            try {
              const distance = await calculateDistance(parking.geometry.location);
              return { ...parking, distance };
            } catch (error) {
              console.error("Failed to calculate distance for parking:", parking.name, error);
              return { ...parking, distance: "N/A" };
            }
          })
        );
        setParkingsWithDistance(updatedParkings);
      }
    };

    addParkingsDistance();
  }, [parkingsWithDistance, userLocation, calculateDistance]);

  const getRoute = (destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    calculateDistance(location.geometry.location);
    getRoute(location.geometry.location);
  };

  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleUserMarkerDragEnd = useCallback((event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    debouncedSetUserLocation({ lat: newLat, lng: newLng });
  }, []);

  const debouncedSetUserLocation = useCallback(debounce((location) => {
    setUserLocation(location);
  }, 500), []); // 500ms delay

  const updateData = useCallback((map) => {
    if (map) {
      fetchPlaces(map, "EV charging station", setEvStations);
      fetchPlaces(map, "parking", setParkingSpaces);
    }
  }, [fetchPlaces, setEvStations, setParkingSpaces]);

  useEffect(() => {
    if (map) {
      updateData(map);
    }
  }, [map, userLocation, updateData]);

  useEffect(() => {
    setStationsWithDistance(evStations);
  }, [evStations]);

  useEffect(() => {
    setParkingsWithDistance(parkingSpaces);
  }, [parkingSpaces]);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="animate-spin"><LoaderPinwheel size={44} color="#020ae8" /></div>
        </div>
      ) : (
        userLocation && (
          <>
            <GoogleMap
              mapContainerStyle={defaultMapContainerStyle}
              center={userLocation}
              zoom={defaultMapZoom}
              options={defaultMapOptions}
              onLoad={(mapInstance) => {
                setMap(mapInstance);
                updateData(mapInstance);
              }}
            >
              <div className="absolute bottom-4 left-4 z-20">
                <button
                  onClick={locate}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Relocate"
                >
                  <Locate className="h-6 w-6 text-blue-500" />
                </button>
              </div>
              <Marker
                draggable={true}
                onDragEnd={handleUserMarkerDragEnd}
                position={userLocation}
                title="Your Location"
                icon={{
                  url: "/user-location.png",
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
              />

              {isMapLoaded &&
                evStations.map((station, index) => (
                  <Marker
                    key={`ev-${index}`}
                    position={{
                      lat: station.geometry.location.lat(),
                      lng: station.geometry.location.lng(),
                    }}
                    title={station.name}
                    icon={evMarkerIcon}
                    onClick={() => handleMarkerClick(station)}
                  />
                ))}

              {isMapLoaded &&
                parkingSpaces.map((space, index) => (
                  <Marker
                    key={`parking-${index}`}
                    position={{
                      lat: space.geometry.location.lat(),
                      lng: space.geometry.location.lng(),
                    }}
                    title={space.name}
                    icon={parkingMarkerIcon}
                    onClick={() => handleMarkerClick(space)}
                  />
                ))}

              {/* InfoWindow for selected location */}
              {selectedLocation && (
                <InfoWindow
                  position={{
                    lat: selectedLocation.geometry.location.lat(),
                    lng: selectedLocation.geometry.location.lng(),
                  }}
                  onCloseClick={() => {
                    setSelectedLocation(null);
                    setDistance(null);
                    setDirections(null);
                  }}
                >
                  <div className="text-black">
                    <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                    <p className="text-sm">{selectedLocation.vicinity}</p>
                    {distance && <p className="font-bold text-[1rem]">Distance: {distance}</p>}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedLocation.geometry.location.lat()},${selectedLocation.geometry.location.lng()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline mt-2 block"
                    >
                      View Route on Google Maps
                    </a>
                  </div>
                </InfoWindow>
              )}

              {/* Directions Renderer */}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: "#000000", // Darker color for the path
                      strokeOpacity: 0.8,
                      strokeWeight: 6,
                    },
                  }}
                />
              )}
            </GoogleMap>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Nearby Charging Stations</h2>
              {stationsWithDistance.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stationsWithDistance.map((station) => (
                    <li
                      key={station.place_id}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center mb-2">
                        <PlugZap className="text-green-500 mr-2" size={20} />
                        <h3 className="text-lg font-semibold text-gray-800">{station.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{station.vicinity}</p>
                      <p className="text-gray-700 mt-2">
                        Distance: {station.distance}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No charging stations found nearby.</p>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Nearby Parking Spaces</h2>
              {parkingsWithDistance.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parkingsWithDistance.map((parking) => (
                    <li
                      key={parking.place_id}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center mb-2">
                        <SquareParking className="text-blue-500 mr-2" size={20} />
                        <h3 className="text-lg font-semibold text-gray-800">{parking.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm">{parking.vicinity}</p>
                      <p className="text-gray-700 mt-2">
                        Distance: {parking.distance}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No parking spaces found nearby.</p>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export { MapComponent };