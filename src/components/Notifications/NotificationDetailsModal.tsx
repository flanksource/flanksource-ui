import {
  getNotificationSendHistoryById,
  getNotificationSendHistorySummaryById
} from "@flanksource-ui/api/services/notifications";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useQuery } from "@tanstack/react-query";
import NotificationDetails from "./NotificationSendHistory/NotificationDetails";

type NotificationDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  hasBodyPayload: boolean;
};

export default function NotificationDetailsModal({
  isOpen,
  id,
  onClose,
  hasBodyPayload
}: NotificationDetailsModalProps) {
  const { data: notification, isLoading } = useQuery(
    ["notification_send_history_detail", id, hasBodyPayload],
    () =>
      hasBodyPayload
        ? getNotificationSendHistoryById(id)
        : getNotificationSendHistorySummaryById(id),
    {
      enabled: isOpen,
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: "always"
    }
  );

  if (!isOpen || isLoading || !notification) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={"Notification Details"}>
      <div className="flex flex-col justify-center overflow-y-auto p-4">
        <NotificationDetails notification={notification} />
      </div>
    </Modal>
  );
}
