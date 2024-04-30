export default function IncidentDetailsPageSkeletonLoader() {
  return (
    <div className="flex flex-col flex-1 h-full animate-pulse">
      <div className="flex flex-row h-auto w-full p-3 space-x-4 items-end border-b border-gray-200 bg-gray-50">
        <div className="w-36 h-full rounded-md bg-gray-200" />
        <div className="flex-1" />
        <div className="h-12 w-12 rounded-full bg-gray-200" />
      </div>
      <div className="overflow-hidden h-full w-full bg-gray-50">
        <div className="pl-6">
          <div className="flex flex-row min-h-full h-auto">
            <div className="flex flex-col flex-1 p-6 min-h-full h-auto mt-2">
              <div className="max-w-3xl lg:max-w-6xl w-full mx-auto mt-2">
                <div className="flex mb-5 justify-between">
                  <div className="w-36 h-8 rounded-md bg-gray-200" />
                  <div className="flex flex-row">
                    <div className="w-20 h-8 mr-4 rounded-md bg-gray-200" />
                    <div className="w-12 h-8 rounded-full bg-gray-200" />
                  </div>
                </div>
                {Array.of(1, 2, 3).map((v) => (
                  <div key={`action-plan-row-${v}`}>
                    <div className="flex flex-row items-center h-[3.3125rem] rounded-lg space-x-2 my-1 bg-gray-200">
                      <div className="w-8 h-8 m-1 ml-2 rounded-full bg-gray-300"></div>
                      <div className="w-48 h-6 rounded-md bg-gray-300"></div>
                      <div className="flex-1" />
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                        <div className="flex flex-col gap-1 w-4 h-6 ml-5 mt-1">
                          {Array.of(1, 2, 3).map((v) => (
                            <div
                              key={`action-plan-dot-${v}`}
                              className="w-1 h-1 rounded-full bg-gray-300"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-7">
                      <div className="h-8 rounded-md bg-gray-200"></div>
                    </div>
                    <div className="w-24 h-6 mb-4 rounded-md mx-auto bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col w-[35rem] h-screen pt-2 border-l border-l-gray-200">
              <div className="flex p-4 pt-2 justify-between border-b border-b-gray-200">
                <div className="w-20 h-9 rounded-md bg-gray-200" />
                <div className="w-[5.625rem] h-9 rounded-md bg-gray-200" />
              </div>
              <div className="grid grid-cols-1-to-2 gap-6 items-center mt-4 mx-4">
                <div className="w-full h-6 rounded-md bg-gray-200" />
                <div className="w-full h-[2.375rem] rounded-md bg-gray-200" />
              </div>
              {Array.of(1, 2).map((v) => (
                <div
                  key={`details-row-${v}`}
                  className="grid grid-cols-1-to-2 gap-6 items-center mt-2.5 mx-4"
                >
                  <div className="w-full h-6 rounded-md bg-gray-200" />
                  <div className="w-1/2 h-6 rounded-md bg-gray-200" />
                </div>
              ))}
              {Array.of(1, 2, 3).map((v) => (
                <div
                  key={`details-row-with-dropdown-${v}`}
                  className="grid grid-cols-1-to-2 gap-6 items-center mt-3 mx-4"
                >
                  <div className="w-full h-6 rounded-md bg-gray-200" />
                  <div className="w-full h-[2.375rem] rounded-md bg-gray-200" />
                </div>
              ))}
              <div className="px-4 pb-3 my-4 border-b border-b-gray-200">
                <div className="w-36 h-9 rounded-md bg-gray-200" />
              </div>
              <div className="w-32 h-5 my-2 mx-4 rounded-md bg-gray-200" />

              <div className="px-4 pb-[.6rem] mt-4 mb-2 border-b border-b-gray-200">
                <div className="w-52 h-9 rounded-md bg-gray-200" />
              </div>
              <div className="w-48 h-5 my-2 mx-4 rounded-md bg-gray-200" />
              <div className="px-4 pb-[.6rem] mt-6 mb-2 border-b border-b-gray-200">
                <div className="w-32 h-9 rounded-md bg-gray-200" />
              </div>
              <div className="mx-4">
                <div className="w-full h-9 mt-1.5 mb-3 rounded-md bg-gray-200" />
                <div className="w-full h-9 mt-1.5 rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
