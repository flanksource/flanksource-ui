import PlaybookPeopleDetails from "@flanksource-ui/components/Playbooks/Runs/Actions/ShowParamaters/PlaybookPeopleLink";
import PlaybookRunLink from "@flanksource-ui/components/Playbooks/Runs/PlaybookRunLink";

type NotificationRecipientLinkProps = {
  playbook_run_id?: string;
  person_id?: string;
};

export default function NotificationRecipientLink({
  playbook_run_id,
  person_id
}: NotificationRecipientLinkProps) {
  if (playbook_run_id) {
    return <PlaybookRunLink runId={playbook_run_id} />;
  }

  if (person_id) {
    return <PlaybookPeopleDetails personId={person_id} />;
  }

  return null;
}
