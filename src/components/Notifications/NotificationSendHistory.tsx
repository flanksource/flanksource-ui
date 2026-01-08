import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useSearchParams } from "react-router-dom";
import NotificationDetailsModal from "./NotificationDetailsModal";
import NotificationResourceDisplay from "./NotificationResourceDisplay";
import { NotificationStatusCell } from "./NotificationsStatusCell";
import NotificationRecipientLink from "./NotificationRecipientLink";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { ConfigItem } from "@flanksource-ui/api/types/configs";
import { Topology } from "@flanksource-ui/api/types/topology";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { Status } from "../Status";

type NotificationSendHistoryWithSubRows = NotificationSendHistoryApiResponse & {
  subRows?: NotificationSendHistoryApiResponse[];
};

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistoryWithSubRows>[] =
  [
    {
      header: "Age",
      accessorKey: "created_at",
      size: 130,
      Cell: ({ row }) => {
        const dateString = row.original.created_at;
        const count = row.original.count;
        const firstObserved = row.original.first_observed;

        return (
          <div className="text-xs">
            <Age from={dateString} />
            {(count || 1) > 1 && (
              <span className="inline-block pl-1 text-gray-500">
                (x{count} over <Age format={"short"} from={firstObserved} />)
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: "Resource",
      size: 150,
      Cell: ({ row }) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="flex flex-row items-center"
          >
            <NotificationResourceDisplay
              resource={row.original.resource}
              resourceKind={row.original.resource_kind}
            />
          </div>
        );
      }
    },
    {
      header: "Health/Status",
      Header: () => <span title="Status of the resource">Status</span>,
      size: 150,
      Cell: ({ row }) => {
        const resource = row.original.resource;
        const resourceKind = row.original.resource_kind;

        const healthAtEvent = row.original.resource_health;
        const statusAtEvent = row.original.resource_status;

        // Only if the health or status has changed, we show the transition in the table
        const isDistinctHealthOrStatus =
          row.original.resource.health !== healthAtEvent ||
          row.original.resource.status !== statusAtEvent;

        return (
          <div className="flex flex-row items-center gap-1">
            {healthAtEvent && statusAtEvent && isDistinctHealthOrStatus && (
              <>
                <Status status={healthAtEvent} statusText={statusAtEvent} />
                <ArrowRightIcon className="mx-1 h-4 w-4 text-gray-500" />
              </>
            )}

            {resourceKind === "check" && (
              <Status
                status={(resource as HealthCheck).status}
                statusText={(resource as HealthCheck).status}
              />
            )}
            {resourceKind === "config" && (
              <Status
                status={(resource as ConfigItem).health}
                statusText={(resource as ConfigItem).status || "Unknown"}
              />
            )}
            {resourceKind === "component" && (
              <Status
                status={(resource as Topology).health}
                statusText={(resource as Topology).status || "Unknown"}
              />
            )}
          </div>
        );
      }
    },
    {
      header: "Notification",
      size: 150,
      Cell: ({ row }) => {
        return (
          <FilterByCellValue
            paramKey={"status"}
            filterValue={row.original.status || ""}
          >
            <NotificationStatusCell row={row} />
          </FilterByCellValue>
        );
      }
    },
    {
      header: "Title",
      size: 300,
      Cell: ({ row }) => {
        const healthDescription = row.original.resource_health_description;
        return (
          <span className="inline-block max-w-[180ch] truncate">
            {healthDescription}
          </span>
        );
      }
    },
    {
      header: "Recipient",
      size: 150,
      Cell: ({ row }) => {
        const { playbook_run, person_id, connection_id } = row.original;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <NotificationRecipientLink
              playbook_run={playbook_run}
              person_id={person_id}
              connection_id={connection_id}
            />
          </div>
        );
      }
    }
  ];

type NotificationSendHistoryListProps = {
  data: NotificationSendHistoryApiResponse[];
  isLoading: boolean;
  refresh?: () => void;
  pageCount: number;
  sendHistoryRowCount: number;
};

export default function NotificationSendHistoryList({
  data,
  isLoading,
  pageCount,
  sendHistoryRowCount
}: NotificationSendHistoryListProps) {
  const [searchParams, setSearchParam] = useSearchParams();

  const id = searchParams.get("id");
  const isOpen = searchParams.has("id");

  return (
    <>
      <MRTDataTable
        data={data}
        columns={notificationSendHistoryColumns}
        isLoading={isLoading}
        enableGrouping={true}
        onRowClick={(row: NotificationSendHistoryWithSubRows) => {
          searchParams.set("id", row.id);
          setSearchParam(searchParams);
        }}
        manualPageCount={pageCount}
        totalRowCount={sendHistoryRowCount}
        enableServerSidePagination
        enableServerSideSorting
      />
      {id && (
        <NotificationDetailsModal
          isOpen={isOpen}
          onClose={() => {
            searchParams.delete("id");
            setSearchParam(searchParams);
          }}
          id={id}
        />
      )}
    </>
  );
}
