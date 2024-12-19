import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useSearchParams } from "react-router-dom";
import NotificationDetailsModal from "./NotificationDetailsModal";
import NotificationResourceDisplay from "./NotificationResourceDisplay";
import { NotificationStatusCell } from "./NotificationsStatusCell";

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
                (x{count} over <Age from={firstObserved} />)
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
      Cell: NotificationStatusCell
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
        const { playbook_run_id, person_id } = row.original;

        const recipient = playbook_run_id
          ? `playbook/${playbook_run_id}`
          : person_id
            ? `person/${person_id}`
            : "";

        // TODO: use a proper component.
        // show connection recipient but the backend doesn't currently store that.
        return <span>{recipient}</span>;
      }
    }
    // {
    //   header: "Body",
    //   size: 400,
    //   Cell: ({ row }) => {
    //     const body = row.original.body;
    //     return <span>{body}</span>;
    //   }
    // }
    // {
    //   header: "First Observed",
    //   Cell: MRTDateCell,
    //   accessorKey: "first_observed"
    // }
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
