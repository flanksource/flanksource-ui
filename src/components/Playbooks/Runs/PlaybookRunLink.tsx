import { getPlaybookRun } from "@flanksource-ui/api/services/playbooks";
import { PlaybookStatusIcon } from "@flanksource-ui/ui/Icons/PlaybookStatusIcon";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { Icon } from "@flanksource-ui/components";

type PlaybookRunLinkProps = {
  runId: string;
};

export default function PlaybookRunLink({ runId }: PlaybookRunLinkProps) {
  const { data: playbookRun, isLoading } = useQuery({
    queryKey: ["playbookRun", runId],
    queryFn: () => getPlaybookRun(runId),
    enabled: !!runId
  });

  if (isLoading) {
    return <TextSkeletonLoader />;
  }

  if (!playbookRun) {
    return null;
  }

  return (
    <Link
      to={`/playbooks/runs/${runId}`}
      className="flex flex-row items-center gap-2 hover:underline"
    >
      <Icon name="playbook" className="h-auto w-5" />
      <span>
        {playbookRun.playbooks?.title ||
          playbookRun.playbooks?.name ||
          "Playbook Run"}
      </span>
      <PlaybookStatusIcon status={playbookRun.status} />
    </Link>
  );
}
