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

type NotificationSendHistorySummaryProps = {
  data: NotificationSendHistorySummary[];
  isLoading: boolean;
  pageCount: number;
  sendHistoryRowCount: number;
};

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistorySummary>[] =
  [
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
      header: "First Observed",
      size: 70,
      Cell: ({ row }) => {
        const dateString = row.original.first_observed;
        return (
          <div className="text-xs">
            <Age from={dateString} />
          </div>
        );
      }
    },
    {
      header: "Last Seen",
      size: 70,
      Cell: ({ row }) => {
        const dateString = row.original.last_seen;
        return (
          <div className="text-xs">
            <Age from={dateString} />
          </div>
        );
      }
    },
    {
      header: "Statistics",
      minSize: 50,
      maxSize: 100,
      Cell: ({ row }) => {
        const statusLines: Count[] = [
          {
            count: row.original.sent,
            color: "bg-green-500/60",
            tooltip: "Sent"
          },
          {
            count: row.original.error,
            color: "bg-red-500/50",
            tooltip: "Error"
          },
          {
            count: row.original.suppressed || 0,
            color: "bg-gray-400/80",
            tooltip: "Suppressed"
          }
        ];

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
