import { MapComponent } from "./components/Map";
import { MapProvider } from "./providers/map-provider";
import SearchBar from "./components/SearchBar"
import StationList from "./components/StationList"
export default function Home() {
  return (
    <main className="flex flex-col pb-10 px-5 bg-black">
<header className="w-screen p-2 text-center verdana relative rounded-lg text- shadow-lg flex flex-col items-center justify-center overflow-hidden">
        <h1 className="text-5xl text-outline font-extrabold text-blue-500 relative">
  <span className="relative text-transparent bg-green-600 bg-clip-text">
    Charge
  </span>Park
</h1>

        <p className="text-sm text-white">EV Charging & Smart Parking Finder</p>
        
      </header>

      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-1/3 p-4">
          <SearchBar />
          <StationList />
        </div>
        <div className="w-full md:w-2/3 ">
        <MapProvider>
      <MapComponent/>
    </MapProvider>
        </div>
      </div>
    </main>
  )

}

