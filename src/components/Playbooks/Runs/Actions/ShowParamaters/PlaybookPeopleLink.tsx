import { getPerson } from "@flanksource-ui/api/services/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";

type PlaybookPeopleDetailsProps = {
  personId: string;
};

export default function PlaybookPeopleDetails({
  personId
}: PlaybookPeopleDetailsProps) {
  const { isLoading, data } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => getPerson(personId),
    enabled: !!personId,
    select: (data) => data.data?.[0]
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={clsx("flex flex-row gap-1")}>
      <Avatar user={data} circular />
      <span className="overflow-hidden text-ellipsis text-sm">
        {data?.name}
      </span>
    </div>
  );
}
