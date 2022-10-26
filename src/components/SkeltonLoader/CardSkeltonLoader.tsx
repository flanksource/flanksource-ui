type Props = {
  showBreadcrumb?: boolean;
};

export default function CardsSkeltonLoader({ showBreadcrumb = false }: Props) {
  return (
    <div className="flex flex-col w-full h-full animate-pulse">
      <div className="flex flex-col w-full">
        {showBreadcrumb && (
          <div className="flex flex-row h-auto w-full bg-gray-50 p-3 space-x-4 items-end border-b border-gray-300">
            <div className="w-36 bg-gray-200 h-full rounded-md "></div>
            <div className="flex-1"></div>
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          </div>
        )}
        <div className="flex flex-wrap flex-1 p-4">
          {Array.of(1, 2, 3).map(() => (
            <div className="flex flex-col w-1/2 p-2">
              <div className="flex flex-col space-y-4 h-auto w-full bg-gray-50 rounded-md p-4 border border-gray-100">
                <div className="w-full bg-gray-200 h-12 rounded-md "></div>
                <div className="w-4/5 bg-gray-200 h-10 rounded-md "></div>
                <div className="w-3/5 bg-gray-200 h-10 rounded-md "></div>
                <div className="w-1/2 bg-gray-200 h-8 rounded-md "></div>
                <div className="w-2/5 bg-gray-200 h-8 rounded-md "></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
