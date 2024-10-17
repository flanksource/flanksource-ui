import { getNotificationSilences } from "@flanksource-ui/api/services/notifications";
import SilenceNotificationsList from "@flanksource-ui/components/Notifications/SilenceNotificationsList";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useQuery } from "@tanstack/react-query";
import NotificationTabsLinks from "../../../components/Notifications/NotificationTabsLinks";

export default function NotificationsSilencedPage() {
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
    <NotificationTabsLinks
      activeTab={"Silences"}
      refresh={refetch}
      isLoading={isLoading || isRefetching}
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
  );
}
