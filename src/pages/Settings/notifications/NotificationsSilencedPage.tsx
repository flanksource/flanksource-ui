import { getNotificationSilences } from "@flanksource-ui/api/services/notifications";
import SilenceNotificationsList from "@flanksource-ui/components/Notifications/SilenceNotificationsList";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import { useQuery } from "@tanstack/react-query";
import NotificationTabsLinks from "../../../components/Notifications/NotificationTabsLinks";

export default function NotificationsSilencedPage() {
  const { pageIndex, pageSize } = useReactTablePaginationState();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["notification_silenced", { pageIndex, pageSize }],
    queryFn: () => getNotificationSilences({ pageIndex, pageSize }),
    keepPreviousData: true
  });

  const notifications = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <NotificationTabsLinks
      activeTab={"Silenced Notifications"}
      refresh={refetch}
      isLoading={isLoading || isRefetching}
    >
      <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
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
