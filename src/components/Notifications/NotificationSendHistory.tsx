import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useSearchParams } from "react-router-dom";
import NotificationDetailsModal from "./NotificationDetailsModal";
import NotificationResourceDisplay from "./NotificationResourceDisplay";
import { NotificationStatusCell } from "./NotificationsStatusCell";
import NotificationRecipientLink from "./NotificationRecipientLink";
import { useMemo } from "react";
import { TbCornerDownRight } from "react-icons/tb";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { ConfigItem } from "@flanksource-ui/api/types/configs";

type NotificationSendHistoryWithSubRows = NotificationSendHistoryApiResponse & {
  subRows?: NotificationSendHistoryApiResponse[];
};

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistoryWithSubRows>[] =
  [
    {
      header: "Age",
      accessorKey: "created_at",
      size: 50,
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
      size: 250,
      Cell: ({ row }) => {
        const parentId = row.original.parent_id;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="flex flex-row items-center"
          >
            <NotificationResourceDisplay notification={row.original} />
          </div>
        );
      }
    },
    {
      header: "Status",
      Header: () => <span title="Status of the resource">Status</span>,
      size: 100,
      Cell: ({ row }) => {
        const resource = row.original.resource;
        const resourceType = row.original.resource_type;
        return (
          <>
            {resourceType === "check" && (
              <span>{(resource as HealthCheck).status}</span>
            )}
            {resourceType === "config" && (
              <span>{(resource as ConfigItem).status}</span>
            )}
            {resourceType === "component" && (
              <span>(resource as Topology).status</span>
            )}
          </>
        );
      }
    },
    {
      header: "Notification",
      size: 100,
      Cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <NotificationStatusCell row={row} />
          </div>
        );
      }
    },
    {
      header: "Event",
      size: 100,
      Cell: ({ row }) => {
        const sourceEvent = row.original.source_event;
        return <span>{sourceEvent}</span>;
      }
    },
    {
      header: "Recipient",
      size: 200,
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

  const id = searchParams.get("id") ?? undefined;
  const isOpen = searchParams.has("id");

  const heirarchicalData = useMemo(() => {
    const child = data.filter((row) => row.parent_id);

    return data
      .filter((row) => !row.parent_id)
      .map((row) => {
        const children = child.filter((child) => child.parent_id === row.id);
        const rowWithSubRows: NotificationSendHistoryWithSubRows = {
          ...row,
          subRows: children
        };
        return rowWithSubRows;
      });
  }, [data]);

  return (
    <>
      <MRTDataTable
        data={heirarchicalData}
        columns={notificationSendHistoryColumns}
        isLoading={isLoading}
        enableExpanding={true}
        enableGrouping={true}
        displayColumnDefOptions={{
          "mrt-row-expand": {
            size: 2,
            Cell: ({ row }) => {
              const parentId = row.original.parent_id;
              if (parentId) {
                return (
                  <TbCornerDownRight
                    className="-ml-4 flex-shrink-0 text-gray-500"
                    size={16}
                  />
                );
              }

              if (row.original.subRows?.length) {
                return (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      row.getToggleExpandedHandler()();
                    }}
                    className={`mrt-table-expand-button ${row.getIsExpanded() ? "rotate-0" : "-rotate-90"} transition-transform`}
                  >
                    ▼
                  </button>
                );
              }

              return <span>{parentId}</span>;
            }
          }
        }}
        onRowClick={(row) => {
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
