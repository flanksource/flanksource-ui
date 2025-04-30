import { NotificationSendHistorySummary } from "@flanksource-ui/api/types/notifications";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useSearchParams } from "react-router-dom";
import NotificationDetailsModal from "./NotificationDetailsModal";
import { MRT_ColumnDef } from "mantine-react-table";
import { Age } from "@flanksource-ui/ui/Age";
import NotificationResourceDisplay from "./NotificationResourceDisplay";
import {
  Count,
  CountBar,
  OrderByColor
} from "@flanksource-ui/ui/Icons/ChangeCount";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { HealthIndicator } from "../Configs/ConfigLink/ConfigLink";

type NotificationSendHistorySummaryProps = {
  data: NotificationSendHistorySummary[];
  isLoading: boolean;
  pageCount: number;
  sendHistoryRowCount: number;
};

function ResourceHealthStatusCell({
  row
}: Pick<MRTCellProps<NotificationSendHistorySummary>, "row">) {
  const { resource_health, resource_status } = row.original;
  const { health, status } = row.original.resource;

  const healthStatusChanged =
    resource_health !== health || resource_status !== status;

  return (
    <div>
      {resource_health && resource_status && healthStatusChanged && (
        <>
          <HealthIndicator health={resource_health} />
          <span className="ml-2">{resource_status || "Unknown"}</span>
          {" ➜ "}
        </>
      )}

      <HealthIndicator health={health} />
      <span className="ml-2">{status || "Unknown"}</span>
    </div>
  );
}

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistorySummary>[] =
  [
    {
      header: "Last Seen",
      size: 70,
      Cell: ({ row }) => {
        const dateString = row.original.last_seen;
        const count = row.original.total;
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
        row.original.resource_type = "config";
        const total = row.original.total;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="flex flex-row items-center"
          >
            <NotificationResourceDisplay notification={row.original} />
            &nbsp;
            <Badge color="blue" size="sm" text={total}></Badge>
          </div>
        );
      }
    },
    {
      header: "Health/Status",
      size: 250,
      Cell: ResourceHealthStatusCell
    },
    {
      header: "Statistics",
      minSize: 50,
      maxSize: 100,
      Cell: ({ row }) => {
        const statusLines: Count[] = [];

        if (row.original.sent > 0) {
          statusLines.push({
            count: row.original.sent,
            color: "bg-green-500/60",
            tooltip: "Sent"
          });
        }

        if (row.original.error > 0) {
          statusLines.push({
            count: row.original.error,
            color: "bg-red-500/50",
            tooltip: "Error"
          });
        }

        if (row.original.suppressed > 0) {
          statusLines.push({
            count: row.original.suppressed,
            color: "bg-gray-400/80",
            tooltip: "Suppressed"
          });
        }

        return <CountBar items={OrderByColor(statusLines)} barStyle="RAG" />;
      }
    }
  ];

export default function NotificationSendHistorySummaryList({
  data,
  isLoading,
  pageCount,
  sendHistoryRowCount
}: NotificationSendHistorySummaryProps) {
  const [searchParams, setSearchParam] = useSearchParams();

  const id = searchParams.get("id") ?? undefined;
  const isOpen = searchParams.has("id");

  return (
    <>
      <MRTDataTable
        data={data}
        columns={notificationSendHistoryColumns}
        isLoading={isLoading}
        enableGrouping={true}
        onRowClick={(row) => {
          console.log("clicked", row);
          // searchParams.set("id", row.id);
          // setSearchParam(searchParams);
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
