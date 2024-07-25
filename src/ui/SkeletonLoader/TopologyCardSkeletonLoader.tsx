export default function TopologyCardSkeletonLoader() {
  return (
    <div className="mb-3 mr-3 w-96 rounded-md px-2 shadow">
      <div className="flex animate-pulse flex-col space-y-2">
        <div className="flex flex-1 flex-row items-center space-x-2">
          <div className="h-12 w-full rounded bg-gray-200"></div>
        </div>
        <div className="border-b border-gray-200"></div>
        <div className="flex-1 pt-2">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-3 rounded bg-gray-200"></div>
              <div className="col-span-1 h-3 rounded bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-3 rounded bg-gray-200"></div>
              <div className="col-span-1 h-3 rounded bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-3 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
