import { useAtom } from "jotai";
import { useEffect } from "react";
import { AiOutlineTeam } from "react-icons/ai";
import { useGetComponentsTeamQuery } from "../../../api/query-hooks";
import PillBadge from "../../../ui/Badge/PillBadge";
import CollapsiblePanel from "../../CollapsiblePanel";
import EmptyState from "../../EmptyState";
import TextSkeletonLoader from "../../SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../../SlidingSideBar";
import Title from "../../Title/title";
import { ComponentTeamLink } from "./ComponentTeamLink";

type Props = {
  componentId: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function ComponentTeams({
  componentId,
  isCollapsed = false,
  onCollapsedStateChange = () => {}
}: Props) {
  const {
    data: componentTeams,
    isLoading,
    refetch,
    isRefetching
  } = useGetComponentsTeamQuery(componentId);

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Teams"
            icon={<AiOutlineTeam className="w-6 h-auto" />}
          />
          <PillBadge>{componentTeams?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={componentTeams?.length}
    >
      <div className="flex flex-col space-y-4 py-2 w-full">
        {isLoading ? (
          <TextSkeletonLoader />
        ) : componentTeams && componentTeams.length > 0 ? (
          componentTeams.map((team) => (
            <ComponentTeamLink
              team={team}
              key={team.team_id + team.component_id}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </CollapsiblePanel>
  );
}
