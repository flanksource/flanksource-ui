import { getNotificationSilencesByID } from "@flanksource-ui/api/services/notifications";
import { NotificationSilenceItemApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { BiRepeat } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { CheckLink } from "../Canary/HealthChecks/CheckLink";
import ConfigLink from "../Configs/ConfigLink/ConfigLink";
import { TopologyLink } from "../Topology/TopologyLink";
import EditNotificationSilenceModal from "./SilenceNotificationForm/EditNotificationSilenceModal";
import ErrorMessage from "@flanksource-ui/ui/FormControls/ErrorMessage";

const silenceNotificationListColumns: MRT_ColumnDef<NotificationSilenceItemApiResponse>[] =
  [
    {
      header: "Resource",
      size: 150,
      Cell: ({ row }) => {
        const check = row.original.checks;
        const catalog = row.original.catalog;
        const component = row.original.component;
        const recursive = row.original.recursive;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className={clsx("flex flex-row items-center")}
          >
            {check && (
              <CheckLink
                check={check}
                className="flex w-full flex-row items-center justify-between space-x-2 rounded-md hover:bg-gray-100"
              />
            )}
            {catalog && <ConfigLink config={catalog} />}
            {component && (
              <TopologyLink
                topology={component}
                className="h-5 w-5 text-gray-600"
                linkClassName="text-gray-600"
                size="md"
              />
            )}
            {row.original.namespace && (
              <Badge text={row.original.namespace} color="blue" />
            )}
            {recursive && <BiRepeat size={18} className="mx-2 inline" />}
          </div>
        );
      }
    },
    {
      header: "Duration",
      size: 50,
      Cell: ({ row }) => {
        const from = row.original.from;
        const until = row.original.until;
        const isExpired = dayjs(until).isBefore(dayjs());

        return (
          <span>
            <Age
              className={clsx(isExpired && "line-through")}
              from={from}
              to={until}
            ></Age>
            {isExpired && <span className="pl-1 text-red-500">Expired</span>}
          </span>
        );
      }
    },
    {
      header: "Source",
      accessorKey: "source",
      size: 50
    },

    {
      header: "Filter",
      accessorKey: "filter",
      size: 100,
      Cell: ({ row }) => {
        return (
          <span className="flex flex-row space-x-1">
            <ErrorMessage message={row.original.error} tooltip={true} />
            <span>{row.original.filter}</span>
          </span>
        );
      }
    },
    {
      header: "Reason",
      accessorKey: "description",
      size: 200
    },
    {
      header: "Created By",
      maxSize: 50,
      minSize: 20,
      Cell: ({ row }) => {
        const user = row.original.createdBy;
        return <Avatar user={user} />;
      }
    }
  ];

type NotificationSendHistoryListProps = {
  data: NotificationSilenceItemApiResponse[];
  isLoading: boolean;
  refresh?: () => void;
  pageCount: number;
  recordCount: number;
};

export default function SilenceNotificationsList({
  data,
  isLoading,
  pageCount,
  recordCount,
  refresh = () => {}
}: NotificationSendHistoryListProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedNotificationSilenceId = searchParams.get("id") ?? undefined;

  const { data: selectedNotificationSilence, refetch } = useQuery({
    queryKey: ["notification_silences", selectedNotificationSilenceId],
    enabled: !!selectedNotificationSilenceId,
    queryFn: async () =>
      getNotificationSilencesByID(selectedNotificationSilenceId!)
  });

  return (
    <>
      <MRTDataTable
        data={data}
        columns={silenceNotificationListColumns}
        onRowClick={(row) => {
          searchParams.set("id", row.id);
          setSearchParams(searchParams);
        }}
        isLoading={isLoading}
        manualPageCount={pageCount}
        enableServerSidePagination
        totalRowCount={recordCount}
        enableServerSideSorting
      />
      {selectedNotificationSilence && (
        <EditNotificationSilenceModal
          isOpen={!!selectedNotificationSilence}
          onUpdate={() => {
            searchParams.delete("id");
            setSearchParams(searchParams);
            refresh();
            refetch();
          }}
          onClose={() => {
            searchParams.delete("id");
            refetch();
            setSearchParams(searchParams);
          }}
          data={selectedNotificationSilence}
        />
      )}
    </>
  );
}
