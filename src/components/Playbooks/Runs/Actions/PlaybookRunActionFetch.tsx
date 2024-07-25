import { Loading } from "@flanksource-ui/ui/Loading";
import { useQuery } from "@tanstack/react-query";
import { getPlaybookRunActionById } from "../../../../api/services/playbooks";
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
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading text="Loading ..." />
      </div>
    );
  }

  return <PlaybooksRunActionsResults action={action} />;
}
