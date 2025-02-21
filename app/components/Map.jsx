"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { LoaderPinwheel, PlugZap, SquareParking } from "lucide-react";

const defaultMapContainerStyle = {
  width: "100%",
  height: "60vh", // Adjusted height
  borderRadius: "1rem",
};

const defaultMapZoom = 14;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeControl: false, // Disable map type control
  fullscreenControl: false, // Disable fullscreen control
};

const fallbackLocation = { lat: 22.5950, lng: 88.4790 };

const MapComponent = ({isLoading, userLocation, isMapLoaded, selectedLocation, directions, updateData, evStations, parkingSpaces, evMarkerIcon, parkingMarkerIcon}) => {
  
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-[60vh] w-full bg-gray-100 rounded-lg shadow-md p-6 gap-4 mx-4 md:mx-8 lg:mx-12">
          <div className="animate-spin"><LoaderPinwheel size={44} color="#020ae8" /></div>
          <p className="text-gray-600 text-sm">Loading map and nearby locations...</p>
          <div className="w-3/4 bg-gray-300 h-4 rounded animate-pulse"></div>
          <div className="w-1/2 bg-gray-300 h-4 rounded animate-pulse"></div>
          <div className="w-2/3 bg-gray-300 h-4 rounded animate-pulse"></div>
        </div>
      ) : (
        userLocation && (
          <div className="mx-4 md:mx-8 lg:mx-12">  {/* Add margin on left and right */}
            <GoogleMap
              mapContainerStyle={defaultMapContainerStyle}
              center={userLocation}
              zoom={defaultMapZoom}
              options={defaultMapOptions}
              onLoad={(map) => {
                updateData(map);
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
                      className="text-blue-500 underline mt-2 block hover:text-blue-700"  // Added hover effect
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
                    suppressMarkers: true, // Remove default markers
                  }}
                />
              )}
            </GoogleMap>
          </div>
          /*  Commented out for cleaner presentation - can be brought back if list is needed here
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
        */
        )
      )}
    </div>
  );
};

export { MapComponent };