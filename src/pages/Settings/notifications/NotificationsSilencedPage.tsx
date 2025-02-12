import { getNotificationSilences } from "@flanksource-ui/api/services/notifications";
import SilenceNotificationsList from "@flanksource-ui/components/Notifications/SilenceNotificationsList";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useQuery } from "@tanstack/react-query";
import NotificationTabsLinks from "../../../components/Notifications/NotificationTabsLinks";
import { Modal } from "@flanksource-ui/components";
import { useState } from "react";
import NotificationSilenceForm from "@flanksource-ui/components/Notifications/SilenceNotificationForm/NotificationSilenceForm";

export default function NotificationsSilencedPage() {
  const [isOpen, setIsOpen] = useState(false);

  const { pageIndex, pageSize } = useReactTablePaginationState();
  const [sortState] = useReactTableSortState();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [
      "notification_silences",
      {
        pageIndex,
        pageSize,
        sortBy: sortState[0]?.id,
        sortOrder: sortState[0]?.desc ? "desc" : "asc"
      }
    ],
    queryFn: () => getNotificationSilences({ pageIndex, pageSize }),
    keepPreviousData: true
  });

  const notifications = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <>
      <NotificationTabsLinks
        activeTab={"Silences"}
        refresh={refetch}
        isLoading={isLoading || isRefetching}
        setIsModalOpen={setIsOpen}
      >
        <div className="flex h-full w-full flex-1 flex-col p-3">
          <SilenceNotificationsList
            data={notifications ?? []}
            isLoading={isLoading || isRefetching}
            refresh={refetch}
            pageCount={pageCount}
            recordCount={totalEntries ?? 0}
          />
        </div>
      </NotificationTabsLinks>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Notification Silence"
        bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      >
        <NotificationSilenceForm />
      </Modal>
    </>
  );
}
