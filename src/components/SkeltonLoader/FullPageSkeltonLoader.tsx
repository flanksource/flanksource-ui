export default function FullPageSkeltonLoader() {
  return (
    <div className="h-screen w-screen flex flex-row animate-pulse">
      <div className="flex flex-col w-56 pt-4 px-4 space-y-6 h-full bg-gray-50 border-r border-gray-300">
        <div className="w-full bg-gray-200 rounded-md h-12 "></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12 "></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
        <div className="w-full bg-gray-200 rounded-md h-12"></div>
      </div>
      <div className="flex flex-col flex-1 h-full">
        <div className="flex flex-row h-auto w-full bg-gray-50 p-3 space-x-4 items-end border-b border-gray-300">
          <div className="w-36 bg-gray-200 h-full rounded-md "></div>
          <div className="flex-1"></div>
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        </div>
        <div className="flex flex-row flex-1 p-4">
          <div className="flex flex-row space-x-4 w-full">
            <div className="flex flex-col w-1/2 p-4 space-y-6 h-48 rounded-md bg-gray-50">
              <div className="w-full bg-gray-200 h-12 rounded-md "></div>
              <div className="w-2/3 bg-gray-200 h-12 rounded-md "></div>
              <div className="w-1/2 bg-gray-200 h-12 rounded-md "></div>
            </div>

            <div className="flex flex-col w-1/2 p-4 space-y-6 h-48 rounded-md bg-gray-50">
              <div className="w-full bg-gray-200 h-12 rounded-md "></div>
              <div className="w-2/3 bg-gray-200 h-12 rounded-md "></div>
              <div className="w-1/2 bg-gray-200 h-12 rounded-md "></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
