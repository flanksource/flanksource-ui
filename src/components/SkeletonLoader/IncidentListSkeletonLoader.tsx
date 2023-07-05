export default function IncidentListSkeletonLoader() {
  return (
    <div className="flex flex-row w-full animate-pulse justify-center">
      <div className="flex flex-col flex-1 w-full max-w-7xl">
        <div className="flex flex-col space-y-2 flex-1">
          {Array.of(1, 2, 3, 4, 5, 6, 7, 8).map((v) => (
            <div className="w-full p-2 h-8 bg-gray-200 rounded" key={v}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
