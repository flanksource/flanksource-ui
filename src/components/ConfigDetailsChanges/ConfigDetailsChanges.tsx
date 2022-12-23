import { InfoMessage } from "../../components/InfoMessage";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";
import { useEffect, useState } from "react";
import { ConfigTypeChanges } from "../ConfigChanges";
import { formatLongDate } from "../../utils/date";
import { JSONViewer } from "../JSONViewer";
import { Icon } from "../Icon";
import { Avatar } from "../Avatar";
import clsx from "clsx";

export function ConfigDetailsChanges({
  configId,
  id,
  viewType = "detailed"
}: {
  id: string;
  configId: string;
  viewType?: "detailed" | "summary";
}) {
  const {
    data: historyData,
    isLoading,
    error
  } = useGetConfigChangesQueryById(configId!);

  const [changeDetails, setChangeDetails] = useState<ConfigTypeChanges>();

  useEffect(() => {
    setChangeDetails(historyData?.find((item) => item.id === id));
  }, [historyData, id]);

  if (error || (!changeDetails && !isLoading)) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <div className="overflow-hidden bg-white">
      {viewType === "detailed" && (
        <div className="px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Icon
                  name={changeDetails?.change_type}
                  secondary="diff"
                  className="w-5 h-auto pr-1"
                />
                {changeDetails?.change_type}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatLongDate(changeDetails?.created_at!)}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Source</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {changeDetails?.source! || "NA"}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Avatar user={changeDetails?.created_by!} />
              </dd>
            </div>
          </dl>
          <div className="py-1">
            <dt className="text-sm font-medium text-gray-500">Details</dt>
            <dd
              className={clsx(
                "mt-1 text-sm text-gray-900 max-h-56 overflow-y-auto overflow-x-auto border-gray-300 border border-gray-200 rounded",
                changeDetails?.details ? "" : "h-16"
              )}
            >
              <JSONViewer
                code={JSON.stringify(changeDetails?.details, null, 2)}
                format="json"
              />
            </dd>
          </div>
          <div className="py-1">
            <dt className="font-medium text-gray-500">Change</dt>
            <dd className="mt-1 text-sm text-gray-900 max-h-56 overflow-y-auto overflow-x-auto border-gray-300 border border-gray-200 rounded">
              <JSONViewer
                code={JSON.stringify(changeDetails?.patches, null, 2)}
                format="json"
              />
            </dd>
          </div>
        </div>
      )}
      {viewType === "summary" && (
        <div className="px-2">
          <dl className="grid grid-cols-1 space-y-1">
            <div className="flex flex-row items-center">
              <dd className="text-gray-500 font-bold overflow-hidden truncate ">
                <Icon
                  name={changeDetails?.change_type}
                  secondary="diff"
                  className="w-5 h-auto pr-1"
                />
                {changeDetails?.change_type}
              </dd>
            </div>
            <div className="flex flex-row items-center">
              <dd className="text-gray-500 overflow-hidden truncate leading-1.21rel font-medium">
                changes made at {formatLongDate(changeDetails?.created_at!)}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
