import { AiOutlineTeam } from "react-icons/ai";
import { useGetComponentsTeamQuery } from "../../api/query-hooks";
import Title from "../Title/title";
import CollapsiblePanel from "../CollapsiblePanel";
import EmptyState from "../EmptyState";
import { ComponentTeamLink } from "./ComponentTeamLink";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import { Badge } from "../Badge";

type Props = {
  componentId: string;
};

export function ComponentTeams({ componentId }: Props) {
  const { data: componentTeams, isLoading } =
    useGetComponentsTeamQuery(componentId);

  return (
    <CollapsiblePanel
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Teams"
            icon={<AiOutlineTeam className="w-6 h-auto" />}
          />
          <Badge
            className="w-5 h-5 flex items-center justify-center"
            roundedClass="rounded-full"
            text={componentTeams?.length ?? 0}
          />
        </div>
      }
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
