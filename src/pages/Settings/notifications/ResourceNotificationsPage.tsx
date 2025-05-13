import { getNotificationSendHistory } from "@flanksource-ui/api/services/notifications";
import NotificationFilterBar from "@flanksource-ui/components/Notifications/Filters/NotificationFilterBar";
import NotificationSendHistoryList from "@flanksource-ui/components/Notifications/NotificationSendHistory";
import NotificationTabsLinks from "@flanksource-ui/components/Notifications/NotificationTabsLinks";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";

export default function ResourceNotificationsPage() {
  const { pageIndex, pageSize } = useReactTablePaginationState();
  const { resourceId } = useParams();

  const [searchParams] = useSearchParams();
  const resourceType = searchParams.get("resource_type") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: [
      "notifications_send_history",
      pageIndex,
      status,
      pageSize,
      resourceType,
      resourceId,
      search
    ],
    queryFn: async () => {
      const res = await getNotificationSendHistory({
        pageIndex,
        pageSize,
        resourceType,
        resourceID: resourceId,
        status,
        search
      });
      return res;
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0
  });

  return (
    <NotificationTabsLinks
      activeTab={"Notifications"}
      refresh={refetch}
      isLoading={isLoading || isRefetching}
    >
      <div className="flex h-full w-full flex-1 flex-col p-3">
        <NotificationFilterBar />
        <NotificationSendHistoryList
          data={data?.data ?? []}
          isLoading={isLoading || isRefetching}
          pageCount={Math.ceil((data?.totalEntries ?? 0) / pageSize)}
          sendHistoryRowCount={data?.totalEntries ?? 0}
        />
      </div>
    </NotificationTabsLinks>
  );
}
