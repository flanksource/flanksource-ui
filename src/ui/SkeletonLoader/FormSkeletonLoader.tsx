export default function FormSkeletonLoader() {
  return (
    <div className="flex w-full animate-pulse flex-col p-2">
      <div className="flex h-auto w-full flex-col gap-4 rounded-md border border-gray-100 bg-gray-50">
        <div className="h-8 w-full rounded-md bg-gray-200"></div>
        <div className="h-8 w-full rounded-md bg-gray-200"></div>
        <div className="h-8 w-full rounded-md bg-gray-200"></div>
        <div className="h-8 w-full rounded-md bg-gray-200"></div>
      </div>
    </div>
  );
}
