import { PlaybookStatusIcon } from "@flanksource-ui/ui/Icons/PlaybookStatusIcon";
import { Link } from "react-router-dom";
import { Icon } from "@flanksource-ui/components";
import { PlaybookRunStatus } from "../../../api/types/playbooks";

type PlaybookRunLinkProps = {
  runId: string;
  playbookName: string;
  status: PlaybookRunStatus;
};

export default function PlaybookRunLink({
  runId,
  playbookName,
  status
}: PlaybookRunLinkProps) {
  return (
    <Link
      to={`/playbooks/runs/${runId}`}
      className="flex flex-row items-center gap-2 hover:underline"
    >
      <Icon name="playbook" className="h-auto w-5" />
      <span>{playbookName}</span>
      <PlaybookStatusIcon status={status} />
    </Link>
  );
}
