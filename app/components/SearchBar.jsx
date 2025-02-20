import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative text-white mb-4">
      <input
        type="text"
        placeholder="Search for charging stations or parking spots"
        className="w-full p-2 pl-10 rounded-full bg-gray-700 focus:bg-gray-600 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all duration-300"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
    </div>
  )
}
