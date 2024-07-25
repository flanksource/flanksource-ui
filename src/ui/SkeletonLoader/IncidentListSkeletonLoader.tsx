import clsx from "clsx";

export default function IncidentListSkeletonLoader() {
  return (
    <div className="flex w-full animate-pulse flex-row justify-center">
      <div className="flex w-full max-w-7xl flex-1 flex-col py-8">
        <div className="flex flex-1 flex-row space-x-4 border-b border-gray-200 pb-4">
          {Array.of(1, 2, 3, 4, 5).map((v) => (
            <div
              className={clsx(
                "h-8 rounded bg-gray-200 p-2",
                v === 5 ? "w-32" : "w-24"
              )}
              key={v}
            ></div>
          ))}
        </div>
        <div className="flex flex-1 flex-col space-y-2 py-4">
          {Array.of(1, 2, 3, 4, 5, 6, 7, 8).map((v) => (
            <div className="h-8 w-full rounded bg-gray-200 p-2" key={v}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
