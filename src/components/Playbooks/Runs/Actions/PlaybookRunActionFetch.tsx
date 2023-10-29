import { useQuery } from "@tanstack/react-query";
import { getPlaybookRunActionById } from "../../../../api/services/playbooks";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";
import { Loading } from "../../../Loading";

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
    return <Loading text="..." />;
  }

  return <PlaybooksRunActionsResults action={action} />;
}
