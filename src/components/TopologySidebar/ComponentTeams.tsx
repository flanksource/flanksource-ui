import { AiOutlineTeam } from "react-icons/ai";
import { useGetComponentsTeamQuery } from "../../api/query-hooks";
import Title from "../Title/title";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";
import EmptyState from "../EmptyState";
import { ComponentTeamLink } from "./ComponentTeamLink";

type Props = {
  componentId: string;
};

export function ComponentTeams({ componentId }: Props) {
  const { data: componentTeams, isLoading } =
    useGetComponentsTeamQuery(componentId);

  return (
    <CollapsiblePanel
      Header={
        <Title title="Teams" icon={<AiOutlineTeam className="w-6 h-auto" />} />
      }
    >
      <div className="flex flex-col space-y-4 py-2 w-full">
        {isLoading ? (
          <Loading />
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
