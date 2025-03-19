import PlaybookPeopleDetails from "@flanksource-ui/components/Playbooks/Runs/Actions/ShowParamaters/PlaybookPeopleLink";
import PlaybookRunLink from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunLink";
import ConnectionLink from "../Connections/ConnectionLink";
import { PlaybookRunStatus } from "../../api/types/playbooks";

type NotificationRecipientLinkProps = {
  playbook_run?: {
    id: string;
    status: PlaybookRunStatus;
    playbook_name: string;
    playbook_id: string;
  };
  person_id?: string;
  connection_id?: string;
};

export default function NotificationRecipientLink({
  playbook_run,
  person_id,
  connection_id
}: NotificationRecipientLinkProps) {
  if (playbook_run) {
    return (
      <PlaybookRunLink
        runId={playbook_run.id}
        playbookName={playbook_run.playbook_name}
        status={playbook_run.status}
      />
    );
  }

  if (person_id) {
    return <PlaybookPeopleDetails personId={person_id} />;
  }

  if (connection_id) {
    return <ConnectionLink connectionId={connection_id} />;
  }

  return null;
}
