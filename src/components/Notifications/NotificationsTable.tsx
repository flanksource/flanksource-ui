import { Row, SortingState, Updater } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { Modal } from "..";
import { DataTable } from "../DataTable";
import EditNotification from "./EditNotification";
import {
  Notification,
  notificationMostCommonErrorAtom,
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
  const [mostCommonErrorNotification, setMostCommonErrorNotification] = useAtom(
    notificationMostCommonErrorAtom
  );
  const modalTitle =
    mostCommonErrorNotification?.title ??
    mostCommonErrorNotification?.person?.name ??
    mostCommonErrorNotification?.team?.name;

  const tableSortByState = useMemo(() => {
    return [
      {
        id: sortBy,
        desc: sortOrder === "desc"
      }
    ];
  }, [sortBy, sortOrder]);

  const onSelectNotification = useCallback((row: Row<Notification>) => {
    const id = row.original.id;
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
      <DataTable
        data={notifications}
        columns={notificationsTableColumns}
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
