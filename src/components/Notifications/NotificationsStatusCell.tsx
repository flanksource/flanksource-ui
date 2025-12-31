import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Status } from "@flanksource-ui/components/Status";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";

export const notificationSendHistoryStatus = {
  sent: {
    label: "Sent",
    status: "healthy",
    icon: <Status status="healthy" variant="dot" />,
    value: "sent",
    id: "sent"
  },
  error: {
    label: "Error",
    status: "unhealthy",
    icon: <Status status="unhealthy" variant="dot" />,
    value: "error",
    id: "error"
  },
  sending: {
    label: "Sending",
    status: "unknown",
    icon: <Status status="unknown" variant="dot" />,
    value: "sending",
    id: "sending"
  },
  pending: {
    label: "Pending",
    status: "unknown",
    icon: <Status status="unknown" variant="dot" />,
    value: "pending",
    id: "pending"
  },
  pending_playbook_run: {
    label: "Pending Playbook Run",
    status: "unknown",
    icon: <Status status="unknown" variant="dot" />,
    value: "pending_playbook_run",
    id: "pending_playbook_run"
  },
  pending_playbook_completion: {
    label: "Playbook In Progress",
    status: "unknown",
    icon: <Status status="unknown" variant="dot" />,
    value: "pending_playbook_completion",
    id: "pending_playbook_completion"
  },
  "evaluating-waitfor": {
    label: "Evaluating WaitFor",
    status: "unknown",
    icon: <Status status="unknown" variant="dot" />,
    value: "evaluating-waitfor",
    id: "evaluating-waitfor"
  },
  "repeat-interval": {
    label: "Repeated",
    status: "suppressed",
    icon: <Status status="suppressed" variant="dot" />,
    value: "repeat-interval",
    id: "repeat-interval"
  },
  silenced: {
    label: "Silenced",
    status: "suppressed",
    icon: <Status status="suppressed" variant="dot" />,
    value: "silenced",
    id: "silenced"
  },
  skipped: {
    label: "Skipped",
    status: "suppressed",
    icon: <Status status="suppressed" variant="dot" />,
    value: "skipped",
    id: "skipped"
  },
  inhibited: {
    label: "Inhibited",
    status: "suppressed",
    icon: <Status status="suppressed" variant="dot" />,
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
