import { useEffect } from "react";
import { BsCardList } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import { RiPlayListAddFill } from "react-icons/ri";
import {
  useIncidentQuery,
  useIncidentsHistoryQuery
} from "../../api/query-hooks";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";
import Title from "../Title/title";
import { VerticalSCrollView } from "../VerticalScrollView/VerticalScrollView";
import IncidentChangelogItem from "./IncidentChangelogItems";

type ChangelogProps = React.HTMLProps<HTMLDivElement> & {
  incidentId: string;
};

export function IncidentChangelog({
  incidentId,
  className = "flex-1 flex-grow bg-white flex flex-col space-y-4",
  ...props
}: ChangelogProps) {
  const {
    data: incidentHistory,
    isLoading,
    isRefetching,
    refetch
  } = useIncidentsHistoryQuery(incidentId);
  const { data: incident } = useIncidentQuery(incidentId!);

  useEffect(() => {
    refetch();
  }, [refetch, incident]);

  return (
    <CollapsiblePanel
      Header={
        <div className="flex flex-row w-full items-center">
          <Title
            title="Changelog"
            icon={<RiPlayListAddFill className="w-6 h-6" />}
          />
          <div
            className="relative z-0 inline-flex justify-end ml-5"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button className="" onClick={() => refetch()}>
              <MdRefresh
                className={`cursor-pointer w-6 h-6 text-zinc-400 inline-block ${
                  isRefetching ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      }
    >
      <div className={className} {...props}>
        {isLoading || !incidentHistory ? (
          <Loading text="Loading ..." />
        ) : incidentHistory.length > 0 ? (
          <VerticalSCrollView>
            <div className="px-8 py-2">
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
    </CollapsiblePanel>
  );
}
