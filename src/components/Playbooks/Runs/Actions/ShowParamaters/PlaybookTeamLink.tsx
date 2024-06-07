import { getTeam } from "@flanksource-ui/api/services/teams";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";

type PlaybookPeopleTeamProps = {
  teamId: string;
};

export default function PlaybookTeamDetails({
  teamId: personId
}: PlaybookPeopleTeamProps) {
  const { isLoading, data } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => getTeam(personId),
    enabled: !!personId
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={clsx("flex flex-row gap-1")}>
      <Icon name={data?.icon} secondary={data?.name} />
      <span className="overflow-hidden text-ellipsis text-sm">
        {data?.name}
      </span>
    </div>
  );
}
