"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

// You can replace this with your Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyA-FCUJgdI-7lag6Vog_OBoisxHAQfTjKU"

export default function Map() {
  const mapRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Define the callback function that Google Maps will call
    window.initMap = () => {
      if (mapRef.current) {
        try {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.006 }, // New York coordinates
            zoom: 13,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          })
          setIsLoading(false)
        } catch (err) {
          setError("Failed to initialize map")
          setIsLoading(false)
        }
      }
    }

    // Load the Google Maps script
    if (!window.google) {
      const script = document.createElement("script")

      if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === "AIzaSyA-FCUJgdI-7lag6Vog_OBoisxHAQfTjKU") {
        setError("Please add your Google Maps API key in the Map.jsx file")
        setIsLoading(false)
        return
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`
      script.async = true
      script.defer = true

      script.onerror = () => {
        setError("Failed to load Google Maps")
        setIsLoading(false)
      }

      document.head.appendChild(script)

      return () => {
        // Cleanup
        document.head.removeChild(script)
        delete window.initMap
      }
    }
  }, [])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-700">
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">Error: {error}</p>
          <p className="text-sm text-gray-100">Please check your Google Maps API key configuration</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-700">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full" />
}

