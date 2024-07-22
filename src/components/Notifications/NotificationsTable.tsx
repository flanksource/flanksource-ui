import { Modal } from "@flanksource-ui/ui/Modal";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import EditNotification from "./EditNotification";
import {
  Notification,
  notificationMostCommonErrorAtom,
  notificationsTableColumns
} from "./notificationsTableColumns";

type NotificationsTableProps = {
  notifications: Notification[];
  isLoading?: boolean;
  refresh?: () => void;
};

export default function NotificationsTable({
  notifications,
  isLoading,
  refresh = () => {}
}: NotificationsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] =
    useState<string>();
  const [mostCommonErrorNotification, setMostCommonErrorNotification] = useAtom(
    notificationMostCommonErrorAtom
  );
  const modalTitle =
    mostCommonErrorNotification?.title ??
    mostCommonErrorNotification?.person?.name ??
    mostCommonErrorNotification?.team?.name;

  const onSelectNotification = useCallback((notification: Notification) => {
    const id = notification.id;
    setSelectedNotificationId(id);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      {mostCommonErrorNotification && (
        <Modal
          open={mostCommonErrorNotification !== undefined}
          onClose={() => setMostCommonErrorNotification(undefined)}
          title={`${modalTitle ?? "Most Common Error"}`}
        >
          <div className="flex flex-col p-4">
            {mostCommonErrorNotification.most_common_error}
          </div>
        </Modal>
      )}
      <MRTDataTable
        data={notifications}
        columns={notificationsTableColumns}
        isLoading={isLoading}
        onRowClick={onSelectNotification}
      />
      {selectedNotificationId && (
        <EditNotification
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          notificationId={selectedNotificationId}
          refresh={refresh}
        />
      )}
    </>
  );
}
