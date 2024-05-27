export default function FormSkeletonLoader() {
  return (
    <div className="flex flex-col w-full animate-pulse p-2">
      <div className="flex flex-col gap-4 h-auto w-full bg-gray-50 rounded-md border border-gray-100">
        <div className="w-full bg-gray-200 h-8 rounded-md "></div>
        <div className="w-full bg-gray-200 h-8 rounded-md "></div>
        <div className="w-full bg-gray-200 h-8 rounded-md "></div>
        <div className="w-full bg-gray-200 h-8 rounded-md "></div>
      </div>
    </div>
  );
}
