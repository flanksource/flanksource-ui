import { PermissionAPIResponse } from "@flanksource-ui/api/types/permissions";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import ConfigLink from "../Configs/ConfigLink/ConfigLink";
import ConnectionIcon from "../Connections/ConnectionIcon";
import PlaybookSpecIcon from "../Playbooks/Settings/PlaybookSpecIcon";
import { TopologyLink } from "../Topology/TopologyLink";
import { permissionObjectList } from "./ManagePermissions/Forms/FormikPermissionSelectResourceFields";
import { permissionsActionsList } from "./PermissionsView";
import { BsBan } from "react-icons/bs";
import { Link } from "react-router-dom";

const permissionsTableColumns: MRT_ColumnDef<PermissionAPIResponse>[] = [
  {
    id: "Resource",
    header: "Resource",
    enableHiding: true,
    size: 250,
    Cell: ({ row }) => {
      const config = row.original.catalog;
      // const check = row.original.checks;
      const playbook = row.original.playbook;
      const component = row.original.component;
      const connection = row.original.connection;
      const object = row.original.object;

      if (object) {
        return permissionObjectList.find((o) => o.value === object)?.label;
      }

      return (
        <div className="flex flex-col">
          {config && <ConfigLink config={config} />}
          {/* {check && <CheckLink check={check} />} */}
          {playbook && <PlaybookSpecIcon playbook={playbook} showLabel />}
          {component && (
            <TopologyLink
              topology={component}
              className="h-5 w-5 text-gray-600"
              linkClassName="text-gray-600"
              size="md"
            />
          )}
          {connection && <ConnectionIcon connection={connection} showLabel />}
        </div>
      );
    }
  },
  {
    header: "Subject",
    size: 100,
    Cell: ({ row }) => {
      const team = row.original.team;
      const person = row.original.person;
      const notification = row.original.notification;

      if (person) {
        return (
          <div className="flex flex-row items-center gap-2">
            <Avatar user={person} />
            <span>{person.name}</span>
          </div>
        );
      }

      if (team) {
        return (
          <div className="flex flex-row items-center gap-2">
            <Icon name={team.icon} className="h-5 w-5 text-gray-600" />
            <span>{team.name}</span>
          </div>
        );
      }

      if (notification) {
        return (
          <div className="flex flex-row items-center gap-2">
            <span>
              <Link
                className="link"
                to="/notifications/rules?id=f488a83b-ee27-40c9-932e-3da77f02a5b9"
              >
                {"notification: " +
                  (notification.namespace ? notification.namespace + "/" : "") +
                  notification.name}
              </Link>
            </span>
          </div>
        );
      }

      return null;
    }
  },
  {
    id: "action",
    header: "Action",
    size: 100,
    Cell: ({ row }) => {
      const action = row.original.action;
      const deny = row.original.deny;

      const actionLabel = permissionsActionsList.find(
        (item) => item.value === action
      )?.label;

      return (
        <div>
          <span>
            {actionLabel ?? action}
            {deny && (
              <BsBan
                color="red"
                className="inline-block h-4 w-auto fill-current object-center pl-1"
              />
            )}
          </span>
        </div>
      );
    }
  },
  {
    id: "updated",
    size: 100,
    header: "Updated",
    accessorFn: (row) => row.updated_at,
    Cell: MRTDateCell
  },
  {
    id: "created",
    size: 100,
    header: "Created",
    accessorFn: (row) => row.created_at,
    Cell: MRTDateCell
  },
  {
    id: "createdBy",
    header: "Created By",
    size: 100,
    Cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      return <Avatar user={createdBy} />;
    }
  }
];

type PermissionsTableProps = {
  permissions: PermissionAPIResponse[];
  isLoading: boolean;
  pageCount: number;
  totalEntries: number;
  handleRowClick?: (row: PermissionAPIResponse) => void;
  hideResourceColumn?: boolean;
};

export default function PermissionsTable({
  permissions,
  isLoading,
  pageCount,
  totalEntries,
  hideResourceColumn = false,
  handleRowClick = () => {}
}: PermissionsTableProps) {
  return (
    <MRTDataTable
      columns={permissionsTableColumns}
      data={permissions}
      isLoading={isLoading}
      manualPageCount={pageCount}
      totalRowCount={totalEntries}
      enableServerSidePagination
      onRowClick={handleRowClick}
      hiddenColumns={hideResourceColumn ? ["Resource"] : []}
    />
  );
}
