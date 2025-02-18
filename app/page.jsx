import Map from "./components/Map"
import SearchBar from "./components/SearchBar"
import StationList from "./components/StationList"
export default function Home() {
  return (
    <main className="flex flex-col h-screen">
<header className="w-screen p-2 text-center bg-gray-900 relative rounded-lg shadow-lg flex flex-col items-center justify-center overflow-hidden">
        <h1 className="text-5xl text-outline font-extrabold text-blue-800 relative">
  <span className="relative text-transparent bg-gradient-to-b from-green-800 to-green-600 bg-clip-text">
    Charge
  </span>Park
</h1>

        <p className="text-sm text-white">EV Charging & Smart Parking Finder</p>
        
      </header>
      <div className=" w-screen h-[2px] bg-gradient-to-r from-gray-500 via-blue-900 to-green-700"></div>

      <div className="flex flex-col md:flex-row flex-grow bg-gray-900/90">
        <div className="w-full md:w-1/3 p-4">
          <SearchBar />
          <StationList />
        </div>
        <div className="w-full md:w-2/3 ">
          <Map />
        </div>
      </div>
    </main>
  )

}

