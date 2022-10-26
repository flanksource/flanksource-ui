type Props = {
  showSidebar?: boolean;
};
export default function HealthPageSkeltonLoader({
  showSidebar = false
}: Props) {
  return (
    <div className="flex flex-row w-full h-screen animate-pulse justify-center">
      {showSidebar && (
        <div className="flex flex-col px-4 py-6 space-y-7 h-full border-r border-gray-300 w-80">
          <div className="w-full bg-gray-200 rounded-md h-24"></div>
          <div className="w-full bg-gray-200 rounded-md h-24"></div>
          <div className="w-full bg-gray-200 rounded-md h-12"></div>
          <div className="w-full bg-gray-200 rounded-md h-12"></div>
        </div>
      )}
      <div className="flex flex-col flex-1 w-full max-w-7xl px-4 py-8">
        <div className="flex flex-col space-y-2 flex-1 p-4">
          {Array.of(1, 2, 3, 4, 5, 6).map(() => (
            <div className="w-full p-2 h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
