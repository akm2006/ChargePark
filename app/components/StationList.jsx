import { PlugZap, SquareParking } from "lucide-react"

const stations = [
  { id: 1, name: "EV Station A", type: "charging", available: 3 },
  { id: 2, name: "Smart Parking B", type: "parking", available: 5 },
  { id: 3, name: "EV Station C", type: "charging", available: 1 },
  { id: 4, name: "Smart Parking D", type: "parking", available: 2 },
]

export default function StationList() {
  return (
    <div className="space-y-5">
      {stations.map((station) => (
        <div key={station.id} className=" text-white bg-gradient-to-l from-blue-500/30 to-green-500/10 p-5 rounded-[10px] ">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {station.type === "charging" ? (
                <PlugZap size={40} strokeWidth={3} className=" text-green-500 mr-4" />
              ) : (
                <SquareParking size={40} strokeWidth={3} className="text-blue-400 mr-4" />
              )}
              <h3 className="font-semibold">{station.name}</h3>
            </div>
            <span className="bg-green-400 text-green-800 px-4 py-1 font-bold rounded-full text-sm">
              {station.available} available
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

