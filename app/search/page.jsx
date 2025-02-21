"use client"

import { MapComponent } from "../components/Map"
import SearchBar from "../components/SearchBar"
import StationList from "../components/StationList"

export default function Home() {
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

      <div className="flex flex-col md:flex-row flex-grow p-4">
        <div className="w-full md:w-1/3 p-4">
          <SearchBar />
          <StationList />
        </div>
        <div className="w-full md:w-2/3">
          <MapComponent />
        </div>
      </div>
    </main>
  )
}

