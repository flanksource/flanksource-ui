import { getNotificationSendHistoryById } from "@flanksource-ui/api/services/notifications";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useQuery } from "@tanstack/react-query";
import NotificationDetails from "./NotificationSendHistory/NotificationDetails";

type NotificationDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

export default function NotificationDetailsModal({
  isOpen,
  id,
  onClose
}: NotificationDetailsModalProps) {
  const { data: notification, isLoading } = useQuery({
    queryKey: ["notifications_send_history_summary", id],
    queryFn: () => getNotificationSendHistoryById(id)
  });

  if (isLoading || !notification) {
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
