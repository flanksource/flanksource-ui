type Props = {
  showSidebar?: boolean;
};
export default function HealthPageSkeletonLoader({
  showSidebar = false
}: Props) {
  return (
    <div className="flex h-screen w-full animate-pulse flex-row justify-center">
      {showSidebar && (
        <div className="flex h-full w-80 flex-col space-y-7 border-r border-gray-300 px-4 py-6">
          <div className="h-24 w-full rounded-md bg-gray-200"></div>
          <div className="h-24 w-full rounded-md bg-gray-200"></div>
          <div className="h-12 w-full rounded-md bg-gray-200"></div>
          <div className="h-12 w-full rounded-md bg-gray-200"></div>
        </div>
      )}
      <div className="flex w-full max-w-7xl flex-1 flex-col px-4 py-8">
        <div className="flex flex-1 flex-col space-y-2 p-4">
          {Array.of(1, 2, 3, 4, 5, 6).map((v) => (
            <div className="h-8 w-full rounded bg-gray-200 p-2" key={v}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
