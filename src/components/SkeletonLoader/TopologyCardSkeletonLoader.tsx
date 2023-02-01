export default function TopologyCardSkeletonLoader() {
  return (
    <div className="shadow rounded-md p-2 w-96">
      <div className="animate-pulse flex flex-col space-y-2">
        <div className="flex-1 flex flex-row space-x-2 items-center">
          <div className="bg-gray-200 h-3 rounded w-full"></div>
        </div>
        <div className="border-b border-gray-200"></div>
        <div className="flex-1">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-3 bg-gray-200 rounded col-span-2"></div>
              <div className="h-3 bg-gray-200 rounded col-span-1"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-3 bg-gray-200 rounded col-span-2"></div>
              <div className="h-3 bg-gray-200 rounded col-span-1"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-3 bg-gray-200 rounded col-span-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
