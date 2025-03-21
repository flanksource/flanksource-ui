import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useSearchParams } from "react-router-dom";
import NotificationDetailsModal from "./NotificationDetailsModal";
import NotificationResourceDisplay from "./NotificationResourceDisplay";
import { NotificationStatusCell } from "./NotificationsStatusCell";
import NotificationRecipientLink from "./NotificationRecipientLink";
import { Tooltip } from "react-tooltip";
import { FaArrowDown } from "react-icons/fa";

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistoryApiResponse>[] =
  [
    {
      header: "Age",
      accessorKey: "created_at",
      size: 40,
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
      size: 100,
      Cell: ({ row }) => {
        const parentID = row.original.parent_id;
        return (
          <div className="flex items-center gap-2">
            <NotificationStatusCell row={row} />
            {parentID && (
              <>
                <FaArrowDown
                  className="h-3 w-3 text-gray-400"
                  data-tooltip-id="retry-tooltip"
                />
                <Tooltip
                  id="retry-tooltip"
                  content="Fallback notification"
                  className="z-[9999]"
                />
              </>
            )}
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

  return (
    <>
      <MRTDataTable
        data={data}
        columns={notificationSendHistoryColumns}
        isLoading={isLoading}
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
