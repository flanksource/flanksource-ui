import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Loading } from "@flanksource-ui/ui/Loading";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { getPlaybookRunActionById } from "../../../../api/services/playbooks";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";

type Props = {
  playbook: PlaybookSpec;
  playbookRunActionId: string;
};

export default function PlaybookRunActionFetch({
  playbook,
  playbookRunActionId
}: Props) {
  const [refreshTrigger] = useAtom(refreshButtonClickedTrigger);

  const {
    data: action,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["playbookRunAction", playbookRunActionId],
    queryFn: () =>
      getPlaybookRunActionById(playbookRunActionId, playbook.spec!),
    enabled: !!playbookRunActionId,
    staleTime: 0,
    cacheTime: 0,
    // We want to refetch the playbook run every 5 seconds when the page is in
    // the background.
    refetchIntervalInBackground: true,
    refetchInterval: (data) => {
      if (data?.status !== "completed" && data?.status !== "failed") {
        return 1000;
      }
      return false;
    }
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  if (isLoading || !action) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading text="Loading ..." />
      </div>
    );
  }

  return <PlaybooksRunActionsResults action={action} />;
}
