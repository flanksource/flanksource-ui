import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { Avatar } from "@flanksource-ui/ui/Avatar";
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
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import CRDSource from "../Settings/CRDSource";

const formatTagText = (key: string, value: string): string => {
  return `${key}: ${value}`;
};

const permissionsTableColumns: MRT_ColumnDef<PermissionsSummary>[] = [
  {
    header: "Subject",
    size: 100,
    Cell: ({ row }) => {
      const { team, group, person, subject, notification, playbook } =
        row.original;

      if (group) {
        const groupName = group.name || subject;
        return (
          <div className="flex flex-row items-center gap-2">
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
    size: 150,
    Cell: ({ row }) => {
      const config = row.original.config_object;
      const playbook = row.original.playbook_object;
      const component = row.original.component_object;
      const connection = row.original.connection_object;
      const object = row.original.object;
      const objectSelector = row.original.object_selector;
      const { tags, agents } = row.original;

      const renderRlsBadges = (): JSX.Element[] => {
        const badges: JSX.Element[] = [];

        // Add tag badges
        if (tags && Object.keys(tags).length > 0) {
          Object.entries(tags).forEach(([key, value]) => {
            badges.push(
              <Badge
                key={`tag-${key}`}
                text={formatTagText(key, value)}
                color="blue"
              />
            );
          });
        }

        // Add agent badges
        if (agents && agents.length > 0) {
          agents.forEach((agent, index) => {
            badges.push(
              <Badge
                key={`agent-${index}`}
                text={`agent: ${agent}`}
                color="gray"
              />
            );
          });
        }

        return badges;
      };

      const rlsBadges = renderRlsBadges();

      if (objectSelector) {
        return (
          <div className="flex flex-row items-center gap-2">
            <span
              className="truncate font-mono text-sm"
              title={JSON.stringify(objectSelector)} // Provides full text on hover
            >
              {JSON.stringify(objectSelector)}
            </span>
            {rlsBadges.length > 0 && (
              <div className="flex flex-wrap gap-1">{rlsBadges}</div>
            )}
          </div>
        );
      }

      if (object) {
        return (
          <div className="flex flex-row items-center gap-2">
            <span>
              {permissionObjectList.find((o) => o.value === object)?.label}
            </span>
            {rlsBadges.length > 0 && (
              <div className="flex flex-wrap gap-1">{rlsBadges}</div>
            )}
          </div>
        );
      }

      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col">
            {config && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Catalog:</span>
                <ConfigLink config={config} />
              </div>
            )}

            {playbook && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Playbook:</span>
                <PlaybookSpecIcon
                  playbook={{
                    ...playbook,
                    title: playbook.name,
                    spec: { icon: playbook.icon || "", actions: [] }
                  }}
                  showLabel
                />
              </div>
            )}

            {component && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Component:</span>
                <TopologyLink
                  topology={component}
                  className="h-5 w-5 text-gray-600"
                  linkClassName="text-gray-600"
                  size="md"
                />
              </div>
            )}

            {connection && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Connection:</span>
                <ConnectionIcon connection={connection} showLabel />
              </div>
            )}
          </div>

          {rlsBadges.length > 0 && (
            <div className="flex flex-wrap gap-1">{rlsBadges}</div>
          )}
        </div>
      );
    }
  },

  {
    id: "action",
    header: "Action",
    size: 40,
    Cell: ({ row }) => {
      const action = row.original.action;
      const deny = row.original.deny;

      const actionLabel = permissionsActionsList.find(
        (item) => item.value === action
      )?.label;

      return (
        <div>
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
        </div>
      );
    }
  },
  {
    id: "description",
    header: "Description",
    size: 200,
    accessorFn: (row) => row.description
  },
  {
    id: "updated",
    size: 40,
    header: "Updated",
    accessorFn: (row) => row.updated_at,
    Cell: MRTDateCell
  },
  {
    id: "created",
    size: 40,
    header: "Created",
    accessorFn: (row) => row.created_at,
    Cell: MRTDateCell
  },
  {
    id: "createdBy",
    header: "Created By",
    size: 40,
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
