import { useEffect } from "react";
import { MdRefresh } from "react-icons/md";
import { useIncidentsHistoryQuery } from "../../api/query-hooks";
import { Loading } from "../Loading";
import { VerticalSCrollView } from "../VerticalScrollView/VerticalScrollView";
import IncidentChangelogItem from "./IncidentChangelogItems";

type ChangelogProps = {
  incidentId: string;
  refreshChangelog: number;
};

export function IncidentChangelog({
  incidentId,
  refreshChangelog
}: ChangelogProps) {
  const {
    data: incidentHistory,
    isLoading,
    isRefetching,
    refetch
  } = useIncidentsHistoryQuery(incidentId);

  useEffect(() => {
    refetch();
  }, [refreshChangelog, refetch]);

  return (
    <div className="bg-white flex flex-col space-y-4">
      <div className="flex flex-row space-x-3 items-center justify-between py-4 border-b border-gray-200 pr-3">
        <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray px-4">
          Changelog
        </h2>
        <button className="" onClick={() => refetch()}>
          <MdRefresh className="cursor-pointer w-6 h-6" />
        </button>
      </div>
      {(isLoading || isRefetching) && <Loading text="Loading ..." />}
      {incidentHistory && incidentHistory.length > 0 ? (
        <VerticalSCrollView maxHeight="150px">
          <div className="px-8">
            <ul className="border-l border-gray-200 dark:border-gray-900 relative flex-col px-4">
              {incidentHistory.map((history) => (
                <IncidentChangelogItem key={history.id} history={history} />
              ))}
            </ul>
          </div>
        </VerticalSCrollView>
      ) : (
        <div className="px-4 py-4">
          <p className="text-gray-800">No changelog found</p>
        </div>
      )}
    </div>
  );
}
