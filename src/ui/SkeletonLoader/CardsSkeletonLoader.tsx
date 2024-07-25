type Props = {
  showBreadcrumb?: boolean;
};

export default function CardsSkeletonLoader({ showBreadcrumb = false }: Props) {
  return (
    <div className="flex h-full w-full animate-pulse flex-col">
      <div className="flex w-full flex-col">
        {showBreadcrumb && (
          <div className="flex h-auto w-full flex-row items-end space-x-4 border-b border-gray-300 bg-gray-50 p-3">
            <div className="h-full w-36 rounded-md bg-gray-200"></div>
            <div className="flex-1"></div>
            <div className="h-12 w-12 rounded-full bg-gray-300"></div>
          </div>
        )}
        <div className="flex flex-1 flex-wrap p-4">
          {Array.of(1, 2, 3).map((item) => (
            <div key={item} className="flex w-1/2 flex-col p-2">
              <div className="flex h-auto w-full flex-col space-y-4 rounded-md border border-gray-100 bg-gray-50 p-4">
                <div className="h-12 w-full rounded-md bg-gray-200"></div>
                <div className="h-10 w-4/5 rounded-md bg-gray-200"></div>
                <div className="h-10 w-3/5 rounded-md bg-gray-200"></div>
                <div className="h-8 w-1/2 rounded-md bg-gray-200"></div>
                <div className="h-8 w-2/5 rounded-md bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
