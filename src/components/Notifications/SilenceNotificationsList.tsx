import { NotificationSilenceItemApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { BiRepeat } from "react-icons/bi";
import { CheckLink } from "../Canary/HealthChecks/CheckLink";
import ConfigLink from "../Configs/ConfigLink/ConfigLink";
import { TopologyLink } from "../Topology/TopologyLink";

const silenceNotificationListColumns: MRT_ColumnDef<NotificationSilenceItemApiResponse>[] =
  [
    {
      header: "Resource",
      Cell: ({ row }) => {
        const check = row.original.checks?.[0];
        const catalog = row.original.catalog?.[0];
        const component = row.original.component?.[0];

        if (check) {
          return <CheckLink check={check} />;
        }

        if (catalog) {
          return <ConfigLink config={catalog} />;
        }

        if (component) {
          return <TopologyLink topology={component} />;
        }
      }
    },
    {
      header: "Duration",
      Cell: ({ row }) => {
        const from = row.original.from;
        const until = row.original.until;

        return <Age from={from} to={until} />;
      }
    },
    {
      header: "Source",
      accessorKey: "source"
    },
    {
      header: "Namespace",
      accessorKey: "namespace"
    },
    {
      header: "Recursive",
      Cell: ({ row }) => {
        const recursive = row.original.recursive;
        return recursive ? <BiRepeat className="text-green-500" /> : null;
      }
    },
    {
      header: "Reason",
      accessorKey: "description"
    },
    {
      header: "Created By",
      Cell: ({ row }) => {
        const user = row.original.createdBy;

        return <Avatar user={user} />;
      }
    }
  ];

type NotificationSendHistoryListProps = {
  data: NotificationSilenceItemApiResponse[];
  isLoading: boolean;
  onRowClick?: (row: NotificationSilenceItemApiResponse) => void;
  refresh?: () => void;
  pageCount: number;
  recordCount: number;
};

export default function SilenceNotificationsList({
  data,
  isLoading,
  onRowClick = () => {},
  pageCount,
  recordCount
}: NotificationSendHistoryListProps) {
  return (
    <MRTDataTable
      data={data}
      columns={silenceNotificationListColumns}
      isLoading={isLoading}
      onRowClick={onRowClick}
      manualPageCount={pageCount}
      enableServerSidePagination={true}
      totalRowCount={recordCount}
    />
  );
}
