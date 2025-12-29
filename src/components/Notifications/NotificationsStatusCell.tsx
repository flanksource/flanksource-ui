import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Status } from "@flanksource-ui/components/Status";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";

export const notificationSendHistoryStatus = {
  sent: {
    label: "Sent",
    status: "healthy",
    value: "sent",
    id: "sent"
  },
  error: {
    label: "Error",
    status: "unhealthy",
    value: "error",
    id: "error"
  },
  sending: {
    label: "Sending",
    status: "unknown",
    value: "sending",
    id: "sending"
  },
  pending: {
    label: "Pending",
    status: "unknown",
    value: "pending",
    id: "pending"
  },
  pending_playbook_run: {
    label: "Pending Playbook Run",
    status: "unknown",
    value: "pending_playbook_run",
    id: "pending_playbook_run"
  },
  pending_playbook_completion: {
    label: "Playbook In Progress",
    status: "unknown",
    value: "pending_playbook_completion",
    id: "pending_playbook_completion"
  },
  "evaluating-waitfor": {
    label: "Evaluating WaitFor",
    status: "unknown",
    value: "evaluating-waitfor",
    id: "evaluating-waitfor"
  },
  "repeat-interval": {
    label: "Repeated",
    status: "suppressed",
    value: "repeat-interval",
    id: "repeat-interval"
  },
  silenced: {
    label: "Silenced",
    status: "suppressed",
    value: "silenced",
    id: "silenced"
  },
  skipped: {
    label: "Skipped",
    status: "suppressed",
    value: "skipped",
    id: "skipped"
  },
  inhibited: {
    label: "Inhibited",
    status: "suppressed",
    value: "inhibited",
    id: "inhibited"
  }
};

export function NotificationStatusCell({
  row
}: Pick<MRTCellProps<NotificationSendHistoryApiResponse>, "row">) {
  const status = row.original.status;

  if (!status) {
    return null;
  }

  const statusConfig =
    notificationSendHistoryStatus[
      status as keyof typeof notificationSendHistoryStatus
    ];

  if (!statusConfig) {
    return <span>{status}</span>;
  }

  return (
    <Status status={statusConfig.status} statusText={statusConfig.label} />
  );
}
