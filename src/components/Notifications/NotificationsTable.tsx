import { Row, SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "../DataTable";
import EditNotification from "./EditNotification";
import {
  Notification,
  notificationsTableColumns
} from "./notificationsTableColumns";

type NotificationsTableProps = {
  notifications: Notification[];
  isLoading?: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  setPageState?: (state: { pageIndex: number; pageSize: number }) => void;
  hiddenColumns?: string[];
  onSortByChanged?: (sortByState: Updater<SortingState>) => void;
  refresh?: () => void;
};

export default function NotificationsTable({
  notifications,
  isLoading,
  hiddenColumns = [],
  sortBy,
  sortOrder,
  onSortByChanged = () => {},
  refresh = () => {}
}: NotificationsTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] =
    useState<string>();
  const tableSortByState = useMemo(() => {
    return [
      {
        id: sortBy,
        desc: sortOrder === "desc"
      }
    ];
  }, [sortBy, sortOrder]);

  const columns = useMemo(() => notificationsTableColumns, []);

  const onSelectNotification = useCallback((row: Row<Notification>) => {
    const id = row.original.id;
    setSelectedNotificationId(id);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <DataTable
        data={notifications}
        columns={columns}
        isLoading={isLoading}
        handleRowClick={onSelectNotification}
        stickyHead
        hiddenColumns={hiddenColumns}
        tableSortByState={tableSortByState}
        onTableSortByChanged={onSortByChanged}
        enableServerSideSorting
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
