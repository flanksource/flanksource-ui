import { getNotificationSendHistory } from "@flanksource-ui/api/services/notifications";
import NotificationSendHistoryList from "@flanksource-ui/components/Notifications/NotificationSendHistory";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import NotificationFilterBar from "../../../components/Notifications/Filters/NotificationFilterBar";
import NotificationTabsLinks from "../../../components/Notifications/NotificationTabsLinks";

export default function NotificationsPage() {
  const { pageIndex, pageSize } = useReactTablePaginationState();

  const [searchParams] = useSearchParams();
  const resourceType = searchParams.get("resource_type") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [
      "notifications_send_history_summary",
      pageIndex,
      pageSize,
      status,
      resourceType
    ],
    queryFn: () =>
      getNotificationSendHistory({
        pageIndex,
        pageSize,
        status,
        resourceType
      }),
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0
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
      <div className="flex h-full w-full flex-1 flex-col p-3">
        <NotificationFilterBar />
        <NotificationSendHistoryList
          data={notifications ?? []}
          isLoading={isLoading || isRefetching}
          pageCount={pageCount}
          sendHistoryRowCount={totalEntries}
        />
      </div>
    </NotificationTabsLinks>
  );
}
