import { getEventQueueStatus } from "@flanksource-ui/api/schemaResources";
import ErrorPage from "@flanksource-ui/components/Errors/ErrorPage";
import EventQueueStatusList from "@flanksource-ui/components/EventQueueStatus/EventQueueStatusList";
import { EventQueueSummary } from "@flanksource-ui/components/EventQueueStatus/eventQueue";
import { SearchLayout } from "@flanksource-ui/components/Layout/SearchLayout";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Head } from "@flanksource-ui/ui/Head";
import TableSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TableSkeletonLoader";
import { useQuery } from "@tanstack/react-query";

export function EventQueueStatusPage() {
  const { isLoading, data, refetch, error } = useQuery<
    EventQueueSummary[],
    Error
  >(
    ["settings", "event_queue_summary", "all"],
    async () => getEventQueueStatus(),
    {
      cacheTime: 0,
      staleTime: 0
    }
  );

  return (
    <>
      <Head prefix="Event Queue Status" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link="/settings/" key={"settings-page"}>
                Event Queue
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex flex-col flex-1 px-6 pb-0 h-full max-w-screen-xl mx-auto">
          {isLoading && !data && (
            <TableSkeletonLoader className="max-w-screen-xl mx-auto" />
          )}
          {data && (
            <EventQueueStatusList
              className="mt-6 overflow-y-hidden"
              data={data}
              isLoading={isLoading}
              onUpdated={refetch}
            />
          )}
          {error && !data && !isLoading && <ErrorPage error={error} />}
        </div>
      </SearchLayout>
    </>
  );
}
