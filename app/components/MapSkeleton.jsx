export function MapSkeleton() {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] bg-gray-800/50 rounded-lg shadow-lg p-6 gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gray-700" />
        <div className="space-y-2 w-full max-w-[200px]">
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto" />
        </div>
        <div className="w-full h-[200px] bg-gray-700 rounded-lg" />
        <div className="grid grid-cols-3 gap-2 w-full max-w-[300px]">
          <div className="h-8 bg-gray-700 rounded" />
          <div className="h-8 bg-gray-700 rounded" />
          <div className="h-8 bg-gray-700 rounded" />
        </div>
      </div>
    )
  }
  
  