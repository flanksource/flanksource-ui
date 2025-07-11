import { NotificationSendHistorySummary } from "@flanksource-ui/api/types/notifications";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const resource = row.original.resource;
  if (!resource) {
    return <span>Deleted</span>;
  }

  const { health, status } = resource;
  return (
    <div>
      <HealthIndicator health={health} />
      <span className="ml-2">{status || "Unknown"}</span>
    </div>
  );
}

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistorySummary>[] =
  [
    {
      header: "Last Seen",
      size: 130,
      Cell: ({ row }) => {
        const dateString = row.original.last_seen;
        const firstObserved = row.original.first_observed;

        return (
          <div className="text-xs">
            <Age from={dateString} />
            {row.original.total > 1 && (
              <span className="inline-block pl-1 text-gray-500">
                (over <Age format={"short"} from={firstObserved} />)
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
        const total = row.original.total;
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
              resourceType={row.original.resource_type}
            />
            &nbsp;
            <Badge color="blue" size="sm" text={total}></Badge>
          </div>
        );
      }
    },
    {
      header: "Health/Status",
      size: 100,
      Cell: ResourceHealthStatusCell
    },
    {
      header: "Title",
      size: 300,
      Cell: ({ row }) => {
        const description = row.original.resource_health_description;
        return <span>{description}</span>;
      }
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
  const navigate = useNavigate();

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
          const resourceId = row.resource?.id;
          // Preserve current search parameters when navigating
          const currentParams = new URLSearchParams(searchParams);
          navigate(
            `/notifications/resource/${resourceId}?${currentParams.toString()}`
          );
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
