import { getNotificationSendHistorySummary } from "@flanksource-ui/api/services/notifications";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import NotificationFilterBar from "../../../components/Notifications/Filters/NotificationFilterBar";
import NotificationTabsLinks from "../../../components/Notifications/NotificationTabsLinks";
import NotificationSendHistorySummaryList from "@flanksource-ui/components/Notifications/NotificationSendHistorySummary";
import { useShowDeletedConfigs } from "@flanksource-ui/store/preference.state";

export default function NotificationsPage() {
  const { pageIndex, pageSize } = useReactTablePaginationState();

  const [searchParams] = useSearchParams();
  const resourceType = searchParams.get("resource_type") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const tags = searchParams.get("tags") ?? undefined;

  const includeDeletedResources = useShowDeletedConfigs();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "notifications_send_history_summary",
      pageIndex,
      pageSize,
      status,
      resourceType,
      search,
      tags,
      includeDeletedResources
    ],
    queryFn: async () => {
      const res = await getNotificationSendHistorySummary({
        pageIndex,
        pageSize,
        status,
        resourceType,
        search,
        tags,
        includeDeletedResources
      });
      return res;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60
  });

  const isInitialLoading = isLoading;
  const isRefetching = !isLoading && isFetching;

  const totalEntries = data?.total;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <NotificationTabsLinks
      activeTab={"Notifications"}
      refresh={refetch}
      isLoading={isInitialLoading}
    >
      <div className="flex h-full w-full flex-1 flex-col p-3">
        <NotificationFilterBar />
        <NotificationSendHistorySummaryList
          data={data?.results ?? []}
          isLoading={isInitialLoading}
          isRefetching={isRefetching}
          pageCount={pageCount}
          sendHistoryRowCount={totalEntries ?? 0}
        />
      </div>
    </NotificationTabsLinks>
  );
}
