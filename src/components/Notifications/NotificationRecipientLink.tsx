import PlaybookPeopleDetails from "@flanksource-ui/components/Playbooks/Runs/Actions/ShowParamaters/PlaybookPeopleLink";
import PlaybookRunLink from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunLink";
import ConnectionLink from "../Connections/ConnectionLink";

type NotificationRecipientLinkProps = {
  playbook_run_id?: string;
  person_id?: string;
  connection_id?: string;
};

export default function NotificationRecipientLink({
  playbook_run_id,
  person_id,
  connection_id
}: NotificationRecipientLinkProps) {
  if (playbook_run_id) {
    return <PlaybookRunLink runId={playbook_run_id} />;
  }

  if (person_id) {
    return <PlaybookPeopleDetails personId={person_id} />;
  }

  if (connection_id) {
    return <ConnectionLink connectionId={connection_id} />;
  }

  return null;
}
