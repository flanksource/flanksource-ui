import { Head } from "../../components/Head/Head";
import { SearchLayout } from "../../components/Layout";
import TableSkeletonLoader from "../../components/SkeletonLoader/TableSkeletonLoader";
import { BreadcrumbNav, BreadcrumbRoot } from "../../components/BreadcrumbNav";
import { useQuery } from "@tanstack/react-query";
import { getEventQueueStatus } from "../../api/schemaResources";
import ErrorPage from "../../components/Errors/ErrorPage";
import { EventQueueStatus } from "../../components/EventQueueStatus/eventQueue";
import EventQueueStatusList from "../../components/EventQueueStatus/EventQueueStatusList";

export function EventQueueStatusPage() {
  const { isLoading, data, refetch, error } = useQuery<
    EventQueueStatus[],
    Error
  >(
    ["settings", "event_queue_status", "all"],
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
              <BreadcrumbRoot link="/settings/">
                Event Queue Status
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
