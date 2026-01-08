import { NotificationSendHistorySummary } from "@flanksource-ui/api/types/notifications";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotificationDetailsModal from "./NotificationDetailsModal";
import { MRT_ColumnDef } from "mantine-react-table";
import { Age } from "@flanksource-ui/ui/Age";
import NotificationResourceDisplay from "./NotificationResourceDisplay";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import TagsFilterCell from "@flanksource-ui/ui/Tags/TagsFilterCell";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { Status } from "../Status";

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
  return <Status status={health} statusText={status || "Unknown"} />;
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
              resourceKind={row.original.resource_kind}
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
      header: "Tags",
      size: 200,
      Cell: ({ row }) => (
        <TagsFilterCell
          tags={row.original.resource_tags || {}}
          filterByTagParamKey="tags"
          useBase64Encoding
        />
      )
    },
    {
      header: "Status",
      minSize: 50,
      maxSize: 250,
      Cell: ({ row }) => {
        return (
          <div className="flex flex-row flex-wrap items-center gap-1">
            {row.original.sent > 0 && (
              <Status
                status="healthy"
                statusText={`${row.original.sent} sent`}
              />
            )}
            {row.original.error > 0 && (
              <Status
                status="unhealthy"
                statusText={`${row.original.error} failed`}
              />
            )}
            {row.original.suppressed > 0 && (
              <Status
                status="suppressed"
                statusText={`${row.original.suppressed} suppressed`}
              />
            )}
          </div>
        );
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
