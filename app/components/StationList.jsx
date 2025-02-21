import { PlugZap, SquareParking } from "lucide-react"

// StationList Component
const stations = [
  { id: 1, name: "EV Station A", type: "charging", available: 3 },
  { id: 2, name: "Smart Parking B", type: "parking", available: 5 },
  { id: 3, name: "EV Station C", type: "charging", available: 1 },
  { id: 4, name: "Smart Parking D", type: "parking", available: 2 },
]

export default function StationList() {
  return (
    <div className="space-y-4">
      {stations.map((station) => (
        <div
          key={station.id}
          className="text-white bg-gray-400/30 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {station.type === "charging" ? (
                <PlugZap size={32} className="text-emerald-400 mr-3" />
              ) : (
                <SquareParking size={32} className="text-blue-400 mr-3" />
              )}
              <h3 className="font-semibold">{station.name}</h3>
            </div>
            <span className="bg-emerald-500 text-gray-900 px-3 py-1 font-bold rounded-full text-sm">
              {station.available} available
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}