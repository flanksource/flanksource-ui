export default function IncidentDetailsPageSkeletonLoader() {
  return (
    <div className="flex h-full flex-1 animate-pulse flex-col">
      <div className="flex h-auto w-full flex-row items-end space-x-4 border-b border-gray-200 bg-gray-50 p-3">
        <div className="h-full w-36 rounded-md bg-gray-200" />
        <div className="flex-1" />
        <div className="h-12 w-12 rounded-full bg-gray-200" />
      </div>
      <div className="h-full w-full overflow-hidden bg-gray-50">
        <div className="pl-6">
          <div className="flex h-auto min-h-full flex-row">
            <div className="mt-2 flex h-auto min-h-full flex-1 flex-col p-6">
              <div className="mx-auto mt-2 w-full max-w-3xl lg:max-w-6xl">
                <div className="mb-5 flex justify-between">
                  <div className="h-8 w-36 rounded-md bg-gray-200" />
                  <div className="flex flex-row">
                    <div className="mr-4 h-8 w-20 rounded-md bg-gray-200" />
                    <div className="h-8 w-12 rounded-full bg-gray-200" />
                  </div>
                </div>
                {Array.of(1, 2, 3).map((v) => (
                  <div key={`action-plan-row-${v}`}>
                    <div className="my-1 flex h-[3.3125rem] flex-row items-center space-x-2 rounded-lg bg-gray-200">
                      <div className="m-1 ml-2 h-8 w-8 rounded-full bg-gray-300"></div>
                      <div className="h-6 w-48 rounded-md bg-gray-300"></div>
                      <div className="flex-1" />
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                        <div className="ml-5 mt-1 flex h-6 w-4 flex-col gap-1">
                          {Array.of(1, 2, 3).map((v) => (
                            <div
                              key={`action-plan-dot-${v}`}
                              className="h-1 w-1 rounded-full bg-gray-300"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-7">
                      <div className="h-8 rounded-md bg-gray-200"></div>
                    </div>
                    <div className="mx-auto mb-4 h-6 w-24 rounded-md bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex h-screen w-[35rem] flex-col border-l border-l-gray-200 pt-2">
              <div className="flex justify-between border-b border-b-gray-200 p-4 pt-2">
                <div className="h-9 w-20 rounded-md bg-gray-200" />
                <div className="h-9 w-[5.625rem] rounded-md bg-gray-200" />
              </div>
              <div className="mx-4 mt-4 grid grid-cols-1-to-2 items-center gap-6">
                <div className="h-6 w-full rounded-md bg-gray-200" />
                <div className="h-[2.375rem] w-full rounded-md bg-gray-200" />
              </div>
              {Array.of(1, 2).map((v) => (
                <div
                  key={`details-row-${v}`}
                  className="mx-4 mt-2.5 grid grid-cols-1-to-2 items-center gap-6"
                >
                  <div className="h-6 w-full rounded-md bg-gray-200" />
                  <div className="h-6 w-1/2 rounded-md bg-gray-200" />
                </div>
              ))}
              {Array.of(1, 2, 3).map((v) => (
                <div
                  key={`details-row-with-dropdown-${v}`}
                  className="mx-4 mt-3 grid grid-cols-1-to-2 items-center gap-6"
                >
                  <div className="h-6 w-full rounded-md bg-gray-200" />
                  <div className="h-[2.375rem] w-full rounded-md bg-gray-200" />
                </div>
              ))}
              <div className="my-4 border-b border-b-gray-200 px-4 pb-3">
                <div className="h-9 w-36 rounded-md bg-gray-200" />
              </div>
              <div className="mx-4 my-2 h-5 w-32 rounded-md bg-gray-200" />

              <div className="mb-2 mt-4 border-b border-b-gray-200 px-4 pb-[.6rem]">
                <div className="h-9 w-52 rounded-md bg-gray-200" />
              </div>
              <div className="mx-4 my-2 h-5 w-48 rounded-md bg-gray-200" />
              <div className="mb-2 mt-6 border-b border-b-gray-200 px-4 pb-[.6rem]">
                <div className="h-9 w-32 rounded-md bg-gray-200" />
              </div>
              <div className="mx-4">
                <div className="mb-3 mt-1.5 h-9 w-full rounded-md bg-gray-200" />
                <div className="mt-1.5 h-9 w-full rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
