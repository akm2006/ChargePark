"use client";

import { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { LoaderPinwheel, PlugZap, SquareParking } from "lucide-react";

const DEFAULT_MAP_CONTAINER_STYLE = {
    width: "100%",
    height: "60vh", // Adjusted height
    borderRadius: "1rem",
};

const DEFAULT_MAP_ZOOM = 14;

const DEFAULT_MAP_OPTIONS = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: "auto",
    mapTypeControl: false, // Disable map type control
    fullscreenControl: false, // Disable fullscreen control
};

const MapComponent = ({
    isLoading,
    userLocation,
    isMapLoaded,
    updateData,
    evStations,
    parkingSpaces,
    evMarkerIcon,
    parkingMarkerIcon,
    selectedLocation,
    directions,
    setSelectedLocation,
    handleMarkerClick,
}) => {
    const [distance, setDistance] = useState(null);

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-[60vh] w-full bg-gray-100 rounded-lg shadow-md p-6 gap-4 mx-4 md:mx-8 lg:mx-12">
                    <div className="animate-spin">
                        <LoaderPinwheel size={44} color="#020ae8" />
                    </div>
                    <p className="text-gray-600 text-sm">Loading map and nearby locations...</p>
                    <div className="w-3/4 bg-gray-300 h-4 rounded animate-pulse"></div>
                    <div className="w-1/2 bg-gray-300 h-4 rounded animate-pulse"></div>
                    <div className="w-2/3 bg-gray-300 h-4 rounded animate-pulse"></div>
                </div>
            ) : (
                userLocation && (
                    <div className="mx-4 md:mx-8 lg:mx-12">
                        {/* Add margin on left and right */}
                        <GoogleMap
                            mapContainerStyle={DEFAULT_MAP_CONTAINER_STYLE}
                            center={userLocation}
                            zoom={DEFAULT_MAP_ZOOM}
                            options={DEFAULT_MAP_OPTIONS}
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
                                            className="text-blue-500 underline mt-2 block hover:text-blue-700" // Added hover effect
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
                )
            )}
        </div>
    );
};

export { MapComponent };