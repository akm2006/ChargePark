"use client";

import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places", "drawing", "geometry"];

export function MapProvider({ children }) {
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    libraries: libraries,
  });

  if (loadError) return <p>Encountered an error while loading Google Maps</p>;

  if (!scriptLoaded) return <p>Map Script is loading...</p>;

  return children;
}