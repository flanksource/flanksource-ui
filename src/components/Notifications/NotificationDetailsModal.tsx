import { NotificationSendHistory } from "@flanksource-ui/api/types/notifications";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useMemo } from "react";

type NotificationDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificationSendHistory;
};

export default function NotificationDetailsModal({
  isOpen,
  onClose,
  notification
}: NotificationDetailsModalProps) {
  const error = useMemo(() => {
    if (!notification.error) {
      return undefined;
    }
    try {
      return JSON.stringify(JSON.parse(notification.error), null, 2);
    } catch (e) {
      return notification.error;
    }
  }, [notification]);

  if (!notification.body && !notification.error) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={"Notification Details"}>
      <div className="flex flex-col justify-center overflow-y-auto p-4">
        {notification.body && (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html: notification.body
            }}
          ></div>
        )}
        {error && <JSONViewer format="json" code={error} />}
      </div>
    </Modal>
  );
}
