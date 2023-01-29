import { useEffect } from "react";
import { MdRefresh } from "react-icons/md";
import { useIncidentsHistoryQuery } from "../../api/query-hooks";
import CollapsiblePanel from "../CollapsiblePanel";
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
    <CollapsiblePanel
      Header={
        <>
          <h2 className="mb-0.5 mt-4 text-2xl font-medium leading-7 text-dark-gray px-4">
            Changelog
          </h2>
          <button className="mt-5" onClick={() => refetch()}>
            <MdRefresh className="cursor-pointer w-5 h-5 mx-5" />
          </button>
        </>
      }
    >
      {isLoading || !incidentHistory ? (
        <Loading text="Loading ..." />
      ) : incidentHistory.length > 0 ? (
        <VerticalSCrollView maxHeight="150px">
          <div className="px-8 mt-4">
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
    </CollapsiblePanel>
  );
}
