import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { BiMerge } from "react-icons/bi";
import { FaBellSlash, FaDotCircle } from "react-icons/fa";

export const notificationSendHistoryStatus = {
  sent: {
    label: "Sent",
    Icon: <FaDotCircle className="fill-green-600" />,
    value: "sent",
    id: "sent"
  },
  error: {
    label: "Error",
    Icon: <FaDotCircle className="fill-red-600" />,
    value: "error",
    id: "error"
  },
  sending: {
    label: "Sending",
    Icon: <FaDotCircle className="fill-gray-600" />,
    value: "sending",
    id: "sending"
  },
  pending: {
    label: "Pending",
    Icon: <FaDotCircle className="fill-gray-600" />,
    value: "pending",
    id: "pending"
  },
  pending_playbook_run: {
    label: "Pending Playbook Run",
    Icon: <FaDotCircle className="fill-gray-600" />,
    value: "pending_playbook_run",
    id: "pending_playbook_run"
  },
  pending_playbook_completion: {
    label: "Playbook In Progress",
    Icon: <FaDotCircle className="fill-gray-600" />,
    value: "pending_playbook_completion",
    id: "pending_playbook_completion"
  },
  "evaluating-waitfor": {
    label: "Evaluating WaitFor",
    Icon: <FaDotCircle className="fill-gray-600" />,
    value: "evaluating-waitfor",
    id: "evaluating-waitfor"
  },
  "repeat-interval": {
    label: "Repeated",
    Icon: <FaBellSlash className="fill-gray-600" />,
    value: "repeat-interval",
    id: "repeat-interval"
  },
  silenced: {
    label: "Silenced",
    Icon: <FaBellSlash className="fill-gray-600" />,
    value: "silenced",
    id: "silenced"
  },
  skipped: {
    label: "Skipped",
    Icon: <FaBellSlash className="fill-gray-600" />,
    value: "skipped",
    id: "skipped"
  },
  inhibited: {
    label: "Inhibited",
    Icon: <BiMerge className="fill-gray-600" />,
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
    <div className="flex items-center space-x-2">
      {statusConfig.Icon}
      <span>{statusConfig.label}</span>
    </div>
  );
}
