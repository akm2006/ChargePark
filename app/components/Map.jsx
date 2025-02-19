
'use client'


import { GoogleMap } from "@react-google-maps/api";

const defaultMapContainerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '1rem',
};

const defaultMapCenter = {
    lat: 22.467012,
    lng: 88.312846
}

const defaultMapZoom = 18

const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
};

const MapComponent = () => {
    return (
        <div className="w-full">
            <GoogleMap
                mapContainerStyle={defaultMapContainerStyle}
                center={defaultMapCenter}
                zoom={defaultMapZoom}
                options={defaultMapOptions}
            >
            </GoogleMap>
        </div>
    )
};

export { MapComponent };