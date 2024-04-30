import clsx from "clsx";

export default function IncidentListSkeletonLoader() {
  return (
    <div className="flex flex-row w-full animate-pulse justify-center">
      <div className="flex flex-col flex-1 w-full max-w-7xl py-8">
        <div className="flex flex-row space-x-4 flex-1 border-b pb-4 border-gray-200">
          {Array.of(1, 2, 3, 4, 5).map((v) => (
            <div
              className={clsx(
                "p-2 h-8 bg-gray-200 rounded",
                v === 5 ? "w-32" : "w-24"
              )}
              key={v}
            ></div>
          ))}
        </div>
        <div className="flex flex-col space-y-2 flex-1 py-4">
          {Array.of(1, 2, 3, 4, 5, 6, 7, 8).map((v) => (
            <div className="w-full p-2 h-8 bg-gray-200 rounded" key={v}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
