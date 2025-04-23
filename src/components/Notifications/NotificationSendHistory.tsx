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
import { HealthIndicator } from "../Configs/ConfigLink/ConfigLink";
import { Topology } from "@flanksource-ui/api/types/topology";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";

type NotificationSendHistoryWithSubRows = NotificationSendHistoryApiResponse & {
  subRows?: NotificationSendHistoryApiResponse[];
};

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistoryWithSubRows>[] =
  [
    {
      header: "Age",
      accessorKey: "created_at",
      size: 70,
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
              <>
                <HealthIndicator health={(resource as HealthCheck).status} />
                <span className="ml-2 capitalize">
                  {(resource as HealthCheck).status}
                </span>
              </>
            )}
            {resourceType === "config" && (
              <>
                <HealthIndicator health={(resource as ConfigItem).health} />
                <span className="ml-2">
                  {(resource as ConfigItem).status || "Unknown"}
                </span>
              </>
            )}
            {resourceType === "component" && (
              <>
                <HealthIndicator health={(resource as Topology).health} />
                <span className="ml-2">
                  {(resource as Topology).status || "Unknown"}
                </span>
              </>
            )}
          </>
        );
      }
    },
    {
      header: "Notification",
      size: 60,
      Cell: ({ row }) => {
        return (
          <FilterByCellValue
            paramKey={"status"}
            filterValue={row.original.status || ""}
          >
            <div className="flex items-center gap-2">
              <NotificationStatusCell row={row} />
            </div>
          </FilterByCellValue>
        );
      }
    },
    {
      header: "Event",
      size: 100,
      Cell: ({ row }) => {
        const sourceEvent = row.original.source_event;
        return <span className="font-mono text-gray-800">{sourceEvent}</span>;
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
    // The latest send history for each group
    const groupLeader: Record<string, string> = {};
    for (const row of data) {
      if (row.group_id && !groupLeader[row.group_id]) {
        groupLeader[row.group_id] = row.id;
      }
    }

    // send histories in the same group should be grouped together
    const histories = data.map((row) => {
      if (row.parent_id || !row.group_id) {
        return { ...row };
      }

      if (!groupLeader[row.group_id] || groupLeader[row.group_id] === row.id) {
        return { ...row };
      }

      return {
        ...row,
        parent_id: groupLeader[row.group_id]
      };
    });

    return histories
      .filter((row) => !row.parent_id)
      .map((row) => {
        const children = histories.filter((c) => c.parent_id === row.id);
        return {
          ...row,
          subRows: children
        };
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
