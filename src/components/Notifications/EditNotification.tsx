import {
  useGetNotificationsByIDQuery,
  useUpdateNotification
} from "../../api/query-hooks/useNotificationsQuery";
import { Modal } from "../../ui/Modal";
import NotificationsForm from "./NotificationsForm";
import { Notification } from "./notificationsTableColumns";

type Props = {
  notificationId: string;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  refresh: () => void;
};

export default function EditNotification({
  notificationId,
  isModalOpen,
  setIsModalOpen,
  refresh = () => {}
}: Props) {
  const { data, refetch } = useGetNotificationsByIDQuery(notificationId, {
    enabled: !!notificationId,
    cacheTime: 0,
    staleTime: 0
  });

  const { mutate: updateNotification } = useUpdateNotification(() => {
    setIsModalOpen(false);
    refresh();
    refetch();
  });

  const onSubmit = (notification: Partial<Notification>) => {
    updateNotification(notification);
  };

  if (!data) {
    return null;
  }

  return (
    <Modal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Edit Notification"
    >
      <NotificationsForm
        onDeleted={() => {
          refresh();
          setIsModalOpen(false);
        }}
        onSubmit={onSubmit}
        notification={data}
      />
    </Modal>
  );
}
