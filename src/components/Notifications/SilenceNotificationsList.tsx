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
import { Icon } from "@flanksource-ui/ui/Icons/Icon";

const silenceNotificationListColumns: MRT_ColumnDef<NotificationSilenceItemApiResponse>[] =
  [
    {
      header: "Name",
      size: 100,
      Cell: ({ row }) => {
        return (
          <span className="flex flex-row space-x-1">
            <span>
              {row.original.name}
              {row.original.source === "KubernetesCRD" && <Icon name="k8s" />}
            </span>
          </span>
        );
      }
    },

    {
      header: "Resource or the filter", // acts as a tooltip
      Header: () => {
        return <span>Target</span>;
      },
      size: 200,
      Cell: ({ row }) => {
        const { filter, error } = row.original;
        if (filter) {
          return (
            <div className="flex flex-col space-y-1 text-gray-600">
              <div className="flex items-center space-x-1">
                <ErrorMessage message={error} tooltip={true} />
                <span
                  className="truncate font-mono text-sm"
                  title={filter} // Provides full text on hover
                >
                  {filter}
                </span>
              </div>
            </div>
          );
        }

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
      header: "Expires At",
      size: 100,
      Cell: ({ row }) => {
        const until = row.original.until;
        if (!until) {
          return <span>Never</span>;
        }

        const isExpired = dayjs(until).isBefore(dayjs());
        const expiresAt = dayjs(until);

        return (
          <span>
            {expiresAt.format("MMMM D, YYYY hh:mm A")}
            {isExpired && <span className="pl-1 text-red-500">(Expired)</span>}
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
