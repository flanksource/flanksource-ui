import { NotificationRules } from "@flanksource-ui/api/types/notifications";
import { Modal } from "@flanksource-ui/ui/Modal";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import EditNotificationRules from "./EditNotificationRules";
import {
  notificationMostCommonErrorAtom,
  notificationsRulesTableColumns
} from "./notificationsRulesTableColumns";

type NotificationsTableProps = {
  notifications: NotificationRules[];
  isLoading?: boolean;
  refresh?: () => void;
  totalRecordCount: number;
  pageCount: number;
};

export default function NotificationsRulesTable({
  notifications,
  isLoading,
  refresh = () => {},
  pageCount,
  totalRecordCount
}: NotificationsTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedNotificationId = searchParams.get("id");

  const [mostCommonErrorNotification, setMostCommonErrorNotification] = useAtom(
    notificationMostCommonErrorAtom
  );
  const modalTitle =
    mostCommonErrorNotification?.title ??
    mostCommonErrorNotification?.person?.name ??
    mostCommonErrorNotification?.team?.name;

  const onSelectNotification = useCallback(
    (notification: NotificationRules) => {
      const id = notification.id;
      searchParams.set("id", id);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

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
        columns={notificationsRulesTableColumns}
        isLoading={isLoading}
        onRowClick={onSelectNotification}
        enableServerSidePagination
        manualPageCount={pageCount}
        totalRowCount={totalRecordCount}
      />
      {selectedNotificationId && (
        <EditNotificationRules
          isModalOpen={!!selectedNotificationId}
          setIsModalOpen={() => {
            searchParams.delete("id");
            setSearchParams(searchParams);
          }}
          notificationId={selectedNotificationId}
          refresh={refresh}
        />
      )}
    </>
  );
}
