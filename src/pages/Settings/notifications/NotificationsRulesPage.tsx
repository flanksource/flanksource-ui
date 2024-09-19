import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useState } from "react";
import {
  useCreateNotification,
  useNotificationsSummaryQuery
} from "../../../api/query-hooks/useNotificationsQuery";
import NotificationTabsLinks from "../../../components/Notifications/NotificationTabsLinks";
import NotificationsRulesForm from "../../../components/Notifications/Rules/NotificationsRulesForm";
import NotificationsRulesTable from "../../../components/Notifications/Rules/NotificationsRulesTable";
import { NotificationRules } from "../../../components/Notifications/Rules/notificationsRulesTableColumns";
import { Modal } from "../../../ui/Modal";

export default function NotificationRulesPage() {
  const [isOpen, setIsOpen] = useState(false);

  const { pageIndex, pageSize } = useReactTablePaginationState();

  const { data, isLoading, refetch, isRefetching } =
    useNotificationsSummaryQuery(
      {
        pageIndex,
        pageSize
      },
      {
        keepPreviousData: true
      }
    );

  const { mutate: createNotification } = useCreateNotification(() => {
    refetch();
    setIsOpen(false);
  });

  const onSubmit = (notification: Partial<NotificationRules>) => {
    createNotification(notification);
  };

  const notifications = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <>
      <NotificationTabsLinks
        activeTab={"Notification Rules"}
        refresh={refetch}
        isLoading={isLoading || isRefetching}
        setIsModalOpen={setIsOpen}
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <NotificationsRulesTable
            notifications={notifications ?? []}
            isLoading={isLoading || isRefetching}
            refresh={refetch}
            totalRecordCount={totalEntries ?? 0}
            pageCount={pageCount}
          />
        </div>
      </NotificationTabsLinks>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Notification"
        bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      >
        <NotificationsRulesForm onSubmit={onSubmit} onDeleted={refetch} />
      </Modal>
    </>
  );
}
