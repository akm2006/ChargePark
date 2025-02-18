import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="relative text-white mb-4">
      <input
        type="text"
        placeholder="Search for charging stations or parking spots"
        className="w-full p-2 pl-10 rounded-full bg-blue-500/20 focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <Search className="absolute left-3 top-2.5 text-white-400" size={20} />
    </div>
  )
}

