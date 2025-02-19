"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { LoaderPinwheel } from "lucide-react";
const defaultMapContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "1rem",
};

const defaultMapZoom = 14;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
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

  const fetchPlaces = (map, keyword, setState) => {
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
      radius: 5000, 
      keyword: keyword,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setState(results);
      } else {
        console.error(`Error fetching ${keyword}:`, status);
      }
    });
  };

  const calculateDistance = (destination) => {
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
          setDistance(distanceText);
        } else {
          console.error("Error calculating distance:", status);
        }
      }
    );
  };

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

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="animate-spin"><LoaderPinwheel size={44} color="#020ae8" /></div> 
        </div>
      ) : (
        userLocation && (
          <GoogleMap
            mapContainerStyle={defaultMapContainerStyle}
            center={userLocation}
            zoom={defaultMapZoom}
            options={defaultMapOptions}
            onLoad={(map) => {
              fetchPlaces(map, "EV charging station", setEvStations);
              fetchPlaces(map, "parking", setParkingSpaces);
            }}
          >
            <Marker
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
        )
      )}
    </div>
  );
};

export { MapComponent };