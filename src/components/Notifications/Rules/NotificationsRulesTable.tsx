import { NotificationRules } from "@flanksource-ui/api/types/notifications";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import EditNotificationRules from "./EditNotificationRules";
import { notificationsRulesTableColumns } from "./notificationsRulesTableColumns";

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
      <MRTDataTable
        data={notifications ?? []}
        columns={notificationsRulesTableColumns}
        isLoading={isLoading}
        onRowClick={onSelectNotification}
        enableServerSidePagination
        manualPageCount={pageCount}
        totalRowCount={totalRecordCount}
        enableServerSideSorting
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
