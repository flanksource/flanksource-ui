import {
  deleteNotificationSilence,
  getNotificationSilencesByID
} from "@flanksource-ui/api/services/notifications";
import { NotificationSilenceItemApiResponse } from "@flanksource-ui/api/types/notifications";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Age } from "@flanksource-ui/ui/Age";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { IconButton } from "@flanksource-ui/ui/Buttons/IconButton";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "mantine-react-table";
import { useState } from "react";
import { BiRepeat } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { CheckLink } from "../Canary/HealthChecks/CheckLink";
import ConfigLink from "../Configs/ConfigLink/ConfigLink";
import { withAuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import { toastError } from "../Toast/toast";
import { TopologyLink } from "../Topology/TopologyLink";
import EditNotificationSilenceModal from "./SilenceNotificationForm/EditNotificationSilenceModal";

function ActionMenu({ handleDelete }: { handleDelete: () => void }) {
  return withAuthorizationAccessCheck(
    <div className="relative">
      <Menu>
        <MenuButton className="min-w-7 rounded-full p-0.5 text-gray-400 hover:text-gray-500">
          <DotsVerticalIcon className="h-6 w-6" />
        </MenuButton>
        <MenuItems
          portal
          anchor="bottom end"
          className="z-10 w-48 divide-y divide-gray-100 rounded-md bg-white shadow-card focus:outline-none"
        >
          <MenuItem
            as="div"
            className="flex w-full cursor-pointer items-center p-3 text-gray-700 hover:bg-gray-200"
            onClick={() => {
              handleDelete();
            }}
          >
            <>
              <IconButton
                className="z-5 mr-2 bg-transparent group-hover:inline-block"
                ovalProps={{
                  stroke: "blue",
                  height: "18px",
                  width: "18px",
                  fill: "transparent"
                }}
                icon={
                  <BsTrash
                    className="border-l-1 border-0 border-gray-200 text-gray-600"
                    size={18}
                  />
                }
              />
              Delete
            </>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>,
    tables.identities,
    "write"
  );
}

const DeleteCell = ({
  row
}: MRTCellProps<NotificationSilenceItemApiResponse>) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = row.original.id;

  const client = useQueryClient();

  const { mutateAsync: deleteItem } = useMutation({
    mutationFn: (id: string) => {
      return deleteNotificationSilence(id);
    },
    onSuccess: () => {
      client.refetchQueries({
        queryKey: ["notification_silences"]
      });
    },
    onError: (error) => {
      toastError((error as Error).message);
    }
  });

  return (
    <>
      {" "}
      <ActionMenu handleDelete={() => setIsOpen(true)} />
      <ConfirmationPromptDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Notification Silence"
        description="Are you sure you want to delete this notification silence?"
        onConfirm={() => deleteItem(id)}
      />
    </>
  );
};

const silenceNotificationListColumns: MRT_ColumnDef<NotificationSilenceItemApiResponse>[] =
  [
    {
      header: "Resource",
      size: 300,
      Cell: ({ row }) => {
        const check = row.original.checks;
        const catalog = row.original.catalog;
        const component = row.original.component;
        const recursive = row.original.recursive;

        const isExpired = dayjs(row.original.until).isBefore(dayjs());

        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className={clsx(
              "flex flex-row items-center",
              isExpired && "line-through"
            )}
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
      size: 100,
      Cell: ({ row }) => {
        const from = row.original.from;
        const until = row.original.until;
        const isExpired = dayjs(until).isBefore(dayjs());

        return (
          <Age
            className={clsx(isExpired && "line-through")}
            from={from}
            to={until}
          />
        );
      }
    },
    {
      header: "Source",
      accessorKey: "source",
      size: 100,
      Cell: ({ row }) => {
        const source = row.original.source;
        const isExpired = dayjs(row.original.until).isBefore(dayjs());
        return (
          <span className={clsx(isExpired && "line-through")}>{source}</span>
        );
      }
    },
    {
      header: "Reason",
      accessorKey: "description",
      size: 400,
      Cell: ({ row }) => {
        const isExpired = dayjs(row.original.until).isBefore(dayjs());
        return (
          <span className={clsx(isExpired && "line-through")}>
            {row.original.description}
          </span>
        );
      }
    },
    {
      header: "Created By",
      size: 100,
      Cell: ({ row }) => {
        const user = row.original.createdBy;

        return <Avatar user={user} />;
      }
    },
    {
      size: 100,
      header: "Delete",
      Cell: DeleteCell
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

  const { data: selectedNotificationSilence } = useQuery({
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
          }}
          onClose={() => {
            searchParams.delete("id");
            setSearchParams(searchParams);
          }}
          data={selectedNotificationSilence}
        />
      )}
    </>
  );
}
