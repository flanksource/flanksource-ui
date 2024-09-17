import { getNotificationSendHistory } from "@flanksource-ui/api/services/notifications";
import NotificationSendHistoryList from "@flanksource-ui/components/Notifications/NotificationSendHistory";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import NotificationTabsLinks from "../../../components/Notifications/NotificationTabsLinks";

export default function NotificationsPage() {
  const { pageIndex, pageSize } = useReactTablePaginationState();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["notifications_send_history", pageIndex, pageSize],
    queryFn: () =>
      getNotificationSendHistory({
        pageIndex,
        pageSize
      })
  });

  const notifications = data?.data ?? [];
  const totalEntries = data?.totalEntries ?? 0;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <NotificationTabsLinks
      activeTab={"Notifications"}
      refresh={refetch}
      isLoading={isLoading || isRefetching}
    >
      <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
        <NotificationSendHistoryList
          data={notifications ?? []}
          isLoading={isLoading || isRefetching}
          pageCount={pageCount}
        />
      </div>
    </NotificationTabsLinks>
  );
}
