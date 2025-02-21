"use client"

import { useState, useEffect, useCallback } from "react";
import { MapComponent } from "../components/Map"
import SearchBar from "../components/SearchBar"
import StationList from "../components/StationList"

export default function Home() {
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoading(false);
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
        console.error(`Error fetching ${keyword}:`, status);
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
      if (evStations.length > 0 && userLocation) {
        const updatedStations = await Promise.all(
          evStations.map(async (station) => {
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
  }, [evStations, userLocation, calculateDistance]);


  useEffect(() => {
    const addParkingsDistance = async () => {
      if (parkingSpaces.length > 0 && userLocation) {
        const updatedParkings = await Promise.all(
          parkingSpaces.map(async (parking) => {
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
  }, [parkingSpaces, userLocation, calculateDistance]);



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


  const updateData = useCallback((map) => {
    if (!initialFetchComplete) {  // Only run if initial fetch not complete
        fetchPlaces(map, "EV charging station", setEvStations);
        fetchPlaces(map, "parking", setParkingSpaces);
    }
    setInitialFetchComplete(true);
}, [fetchPlaces, setEvStations, setParkingSpaces, initialFetchComplete]); // fetchPlaces needs to be in dependency array

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="w-full p-4 text-center relative rounded-lg shadow-lg flex flex-col items-center justify-center overflow-hidden">
        <h1 className="text-5xl font-extrabold relative">
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Charge
          </span>
          <span className="text-white">Park</span>
        </h1>
        <p className="text-sm text-blue-200">EV Charging & Smart Parking Finder</p>
      </header>

      {/* Map Component taking full width */}
      <div className="w-full">
        <MapComponent isLoading={isLoading} userLocation = {userLocation} isMapLoaded = {isMapLoaded} updateData={updateData} evStations = {evStations} parkingSpaces={parkingSpaces} evMarkerIcon={evMarkerIcon} parkingMarkerIcon={parkingMarkerIcon} />
      </div>

      {/* Search and StationList below the map, taking full width and stacking vertically on smaller screens */}
      <div className="flex flex-col w-full p-4">
       
        <StationList stationsWithDistance={stationsWithDistance}
    parkingsWithDistance={parkingsWithDistance}
    onLocationSelect={handleMarkerClick}
    selectedLocation={selectedLocation}/>
      </div>
    </main>
  )
}