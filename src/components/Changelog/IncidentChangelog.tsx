import { useEffect } from "react";
import { MdRefresh } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import { useIncidentsHistoryQuery } from "../../api/query-hooks";
import { useIncidentState } from "../../store/incident.state";
import { CountBadge } from "../Badge/CountBadge";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";
import Title from "../Title/title";
import { VerticalSCrollView } from "../VerticalScrollView/VerticalScrollView";
import IncidentChangelogItem from "./IncidentChangelogItems";

type ChangelogProps = React.HTMLProps<HTMLDivElement> & {
  incidentId: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function IncidentChangelog({
  incidentId,
  className = "flex-1 flex-grow bg-white flex flex-col space-y-4",
  isCollapsed,
  onCollapsedStateChange,
  ...props
}: ChangelogProps) {
  const {
    data: incidentHistory,
    isLoading,
    isRefetching,
    refetch
  } = useIncidentsHistoryQuery(incidentId);
  const { incident } = useIncidentState(incidentId);

  useEffect(() => {
    refetch();
  }, [refetch, incident]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Changelog"
            icon={<RiPlayListAddFill className="w-6 h-6" />}
          />
          <CountBadge
            roundedClass="rounded-full"
            value={incidentHistory?.length ?? 0}
          />
          <div
            className="relative z-0 inline-flex justify-end ml-5"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button className="" onClick={() => refetch()}>
              <ClickableSvg>
                <MdRefresh
                  className={`cursor-pointer w-6 h-6 inline-block ${
                    isRefetching ? "animate-spin" : ""
                  }`}
                />
              </ClickableSvg>
            </button>
          </div>
        </div>
      }
      className={className}
      {...props}
      dataCount={incidentHistory?.length}
    >
      {isLoading || !incidentHistory ? (
        <Loading text="Loading ..." />
      ) : incidentHistory.length > 0 ? (
        <VerticalSCrollView>
          <div className="px-4 py-4">
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
