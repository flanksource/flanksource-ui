import { useQuery } from "@tanstack/react-query";
import { getPlaybookRunActionById } from "../../../../api/services/playbooks";
import TableSkeletonLoader from "../../../SkeletonLoader/TableSkeletonLoader";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";

type Props = {
  playbookRunActionId: string;
};

export default function PlaybookRunActionFetch({ playbookRunActionId }: Props) {
  const { data: action, isLoading } = useQuery({
    queryKey: ["playbookRunAction", playbookRunActionId],
    queryFn: () => getPlaybookRunActionById(playbookRunActionId),
    enabled: !!playbookRunActionId
  });

  if (isLoading || !action) {
    return <TableSkeletonLoader />;
  }

  return <PlaybooksRunActionsResults action={action} />;
}
