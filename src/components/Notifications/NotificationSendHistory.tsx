import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";

const notificationSendHistoryColumns: MRT_ColumnDef<NotificationSendHistoryApiResponse>[] =
  [
    {
      header: "Subject",
      Cell: ({ row }) => {
        const user = row.original.person;

        return <Avatar user={user} />;
      }
    },
    {
      header: "Status",
      Cell: ({ row }) => {
        const status = row.original.status;
        return <span>{status}</span>;
      }
    },
    {
      header: "Body",
      Cell: ({ row }) => {
        const body = row.original.body;
        return <span>{body}</span>;
      }
    },
    {
      header: "Count",
      Cell: ({ row }) => {
        const count = row.original.count;
        return <span>{count}</span>;
      }
    },
    {
      header: "First Observed",
      Cell: MRTDateCell,
      accessorKey: "first_observed"
    },
    {
      header: "Source Event",
      Cell: ({ row }) => {
        const sourceEvent = row.original.source_event;
        return <span>{sourceEvent}</span>;
      }
    },
    {
      header: "Age",
      accessorKey: "created_at",
      Cell: (props) => {
        return <MRTDateCell {...props} />;
      }
    }
  ];

type NotificationSendHistoryListProps = {
  data: NotificationSendHistoryApiResponse[];
  isLoading: boolean;
  onRowClick?: (row: NotificationSendHistoryApiResponse) => void;
  refresh?: () => void;
  pageCount: number;
};

export default function NotificationSendHistoryList({
  data,
  isLoading,
  onRowClick = () => {},
  pageCount
}: NotificationSendHistoryListProps) {
  return (
    <MRTDataTable
      data={data}
      columns={notificationSendHistoryColumns}
      isLoading={isLoading}
      onRowClick={onRowClick}
      manualPageCount={pageCount}
      enableServerSidePagination={true}
    />
  );
}
