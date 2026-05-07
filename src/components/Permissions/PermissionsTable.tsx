import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import PlaybookSpecIcon from "../Playbooks/Settings/PlaybookSpecIcon";
import { permissionsActionsList } from "./PermissionsView";
import { BsBan, BsBell } from "react-icons/bs";
import { UserGroupIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import CRDSource from "../Settings/CRDSource";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import PermissionResourceCell from "./PermissionResourceCell";

const permissionsTableColumns: MRT_ColumnDef<PermissionsSummary>[] = [
  {
    id: "subject",
    accessorFn: (row) => row.subject,
    header: "Subject",
    size: 80,
    Cell: ({ row }) => {
      const { team, group, person, subject, notification, playbook } =
        row.original;

      if (group) {
        const groupName = group.name || subject;
        return (
          <div className="flex flex-row items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-gray-600" />
            <span className="truncate font-mono text-sm" title={groupName}>
              {group.name ? "Group: " : "Role: "}
              {groupName}
              {/* Add link to permission group when we have a permission group page */}
            </span>
          </div>
        );
      }

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
            <BsBell className="h-5 w-5 text-gray-600" />
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

      if (playbook) {
        return (
          <div className="flex flex-row items-center gap-2">
            <span>
              <Link
                className="link"
                to={`/playbooks/runs?playbook=${playbook.id}`}
              >
                <span className="inline-flex items-center gap-1">
                  {"playbook: "}
                  <PlaybookSpecIcon playbook={playbook} showLabel />
                </span>
              </Link>
            </span>
          </div>
        );
      }

      return null;
    }
  },
  {
    id: "Resource",
    header: "Resource",
    enableHiding: true,
    enableSorting: false,
    size: 150,
    Cell: ({ row }) => <PermissionResourceCell permission={row.original} />
  },

  {
    id: "action",
    accessorFn: (row) => row.action,
    header: "Action",
    size: 70,
    Cell: ({ row }) => {
      const action = row.original.action;
      const deny = row.original.deny;

      const actionLabel = permissionsActionsList.find(
        (item) => item.value === action
      )?.label;

      return (
        <FilterByCellValue paramKey="action" filterValue={action}>
          <span
            className="truncate font-mono text-sm"
            title={action} // Provides full text on hover
          >
            {actionLabel ?? action}
            {deny && (
              <BsBan
                color="red"
                className="inline-block h-4 w-auto fill-current object-center pl-1"
              />
            )}
          </span>
        </FilterByCellValue>
      );
    }
  },
  {
    id: "description",
    header: "Description",
    enableSorting: false,
    size: 200,
    accessorFn: (row) => row.description
  },
  {
    id: "updated_at",
    size: 40,
    header: "Updated",
    accessorFn: (row) => row.updated_at,
    Cell: MRTDateCell
  },
  {
    id: "created_at",
    size: 40,
    header: "Created",
    accessorFn: (row) => row.created_at,
    Cell: MRTDateCell
  },
  {
    id: "created_by",
    accessorFn: (row) => row.created_by,
    header: "Created By",
    size: 50,
    Cell: ({ row }) => {
      const createdBy = row.original.created_by;
      const source = row.original.source;

      if (source?.toLowerCase() === "KubernetesCRD".toLowerCase()) {
        const id = row.original.id;
        return <CRDSource source={source} id={id} showMinimal />;
      }

      if (!createdBy) {
        return null;
      }

      return <Avatar user={createdBy} />;
    }
  }
];

type PermissionsTableProps = {
  permissions: PermissionsSummary[];
  isLoading: boolean;
  pageCount: number;
  totalEntries: number;
  handleRowClick?: (row: PermissionsSummary) => void;
  hideResourceColumn?: boolean;
  hideSubjectColumn?: boolean;
};

export default function PermissionsTable({
  permissions,
  isLoading,
  pageCount,
  totalEntries,
  hideResourceColumn = false,
  hideSubjectColumn = false,
  handleRowClick = () => {}
}: PermissionsTableProps) {
  const hiddenColumns = [
    ...(hideResourceColumn ? ["Resource"] : []),
    ...(hideSubjectColumn ? ["subject"] : [])
  ];
  const tableKey = hiddenColumns.join("|") || "none";

  return (
    <MRTDataTable
      key={tableKey}
      columns={permissionsTableColumns}
      data={permissions}
      isLoading={isLoading}
      manualPageCount={pageCount}
      totalRowCount={totalEntries}
      enableServerSidePagination
      enableServerSideSorting
      onRowClick={handleRowClick}
      hiddenColumns={hiddenColumns}
    />
  );
}
