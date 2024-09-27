import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { FaBan, FaBellSlash, FaDotCircle } from "react-icons/fa";

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
  pending: {
    label: "Pending",
    Icon: <FaDotCircle className="fill-gray-600" />,
    value: "pending",
    id: "pending"
  },
  cancelled: {
    label: "Cancelled",
    Icon: <FaBan className="fill-red-600" />,
    value: "cancelled",
    id: "cancelled"
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
    return status;
  }

  return (
    <div className="flex items-center space-x-2">
      {statusConfig.Icon}
      <span>{statusConfig.label}</span>
    </div>
  );
}
