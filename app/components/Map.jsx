"use client";

import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { LoaderPinwheel } from "lucide-react";

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
    const mapRef = useRef();
    const directionsRendererRef = useRef();

    useEffect(() => {
        if (selectedLocation && userLocation && window.google) {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [userLocation],
                    destinations: [selectedLocation.geometry.location],
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                    if (status === window.google.maps.DistanceMatrixStatus.OK) {
                        const distanceText = response.rows[0].elements[0].distance?.text || "N/A";
                        setDistance(distanceText);
                    } else {
                        console.error("Error calculating driving distance:", status);
                        setDistance("N/A");
                    }
                }
            );
        } else {
            setDistance(null);
        }
    }, [selectedLocation, userLocation, directions]);

    useEffect(() => {
        if (userLocation && window.google && mapRef.current) {
            const map = mapRef.current;
            map.panTo(userLocation);
            map.setZoom(12);
        }
    }, [userLocation]);

    useEffect(() => {
        if (userLocation && (evStations.length > 0 || parkingSpaces.length > 0)) {
            const locations = [...evStations, ...parkingSpaces];
            const nearestLocation = locations.reduce((nearest, location) => {
                const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                    new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
                    location.geometry.location
                );
                return !nearest || distance < nearest.distance ? { location, distance } : nearest;
            }, null);

            if (nearestLocation) handleMarkerClick(nearestLocation.location);
        }
    }, [userLocation, evStations, parkingSpaces]);

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-800/50 rounded-lg shadow-md p-6 gap-4 mx-4 md:mx-8 lg:mx-12">
                    <div className="animate-spin">
                        <LoaderPinwheel size={44} color="#020ae8" />
                    </div>
                    <p className="text-gray-600 text-sm">Loading map and nearby locations...</p>
                </div>
            ) : (
                userLocation && (
                    <div className="mx-4 md:mx-8 lg:mx-12">
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "60vh", borderRadius: "1rem" }}
                            center={userLocation}
                            zoom={10}
                            options={{
                                zoomControl: true,
                                tilt: 0,
                                gestureHandling: "auto",
                                mapTypeControl: false,
                                fullscreenControl: true,
                                backgroundColor: "#rgba(0,0,0,0)",
                            }}
                            onLoad={(map) => {
                                mapRef.current = map;
                                updateData(map);
                            }}
                        >
                            <Marker position={userLocation} title="Your Location" icon={{ url: "/user-location.png", scaledSize: new window.google.maps.Size(50, 50) }} />

                            {isMapLoaded &&
                                evStations.map((station, index) => (
                                    <Marker key={`ev-${index}`} position={station.geometry.location} title={station.name} icon={evMarkerIcon} onClick={() => handleMarkerClick(station)} />
                                ))}

                            {isMapLoaded &&
                                parkingSpaces.map((space, index) => (
                                    <Marker key={`parking-${index}`} position={space.geometry.location} title={space.name} icon={parkingMarkerIcon} onClick={() => handleMarkerClick(space)} />
                                ))}

                            {selectedLocation && (
                                <InfoWindow
                                    position={selectedLocation.geometry.location}
                                    onCloseClick={() => setSelectedLocation(null)}
                                >
                                    <div className="text-black">
                                        <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                                        <p className="text-sm">{selectedLocation.vicinity}</p>
                                        {distance && <p className="font-bold text-[1rem]">Driving Distance: {distance}</p>}
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedLocation.geometry.location.lat()},${selectedLocation.geometry.location.lng()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline mt-2 block hover:text-blue-700"
                                        >
                                            View Route on Google Maps
                                        </a>
                                    </div>
                                </InfoWindow>
                            )}

                            {directions && (
                                <DirectionsRenderer
                                    directions={directions}
                                    options={{
                                        polylineOptions: {
                                            strokeColor: "#000000",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 4,
                                        },
                                        suppressMarkers: true,
                                    }}
                                    onLoad={(renderer) => (directionsRendererRef.current = renderer)}
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
