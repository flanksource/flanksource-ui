import {
  RoleBindingDisplay,
  RoleBindingSubjects,
  roleBindingResourceSubjectKinds
} from "@flanksource-ui/api/types/roleBindings";
import { RbacObjectStatus } from "@flanksource-ui/components/Permissions/Rbac/RbacObjectStatus";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { MRTDateCell } from "@flanksource-ui/ui/MRTDataTable/Cells/MRTDateCells";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";

function plural(count: number, word: string) {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

// A short label per kind of subject, e.g. "platform", "3 people", "everyone"
export function summarizeSubjects(subjects: RoleBindingSubjects = {}) {
  const labels: string[] = [];
  const people = subjects.people ?? [];
  if (people.length === 1) {
    labels.push(people[0]);
  } else if (people.length > 1) {
    labels.push(plural(people.length, "person").replace("persons", "people"));
  }
  (subjects.teams ?? []).forEach((team) => labels.push(`team ${team}`));
  (subjects.roles ?? []).forEach((role) => labels.push(role));
  (subjects.oidc ?? []).forEach((subject) =>
    labels.push(`${subject.provider} users`)
  );
  roleBindingResourceSubjectKinds.forEach((kind) => {
    const count = subjects[kind]?.length ?? 0;
    if (count > 0) {
      labels.push(`${count} ${kind}`);
    }
  });
  return labels;
}

const roleBindingsTableColumns: MRT_ColumnDef<RoleBindingDisplay>[] = [
  {
    header: "Name",
    id: "name",
    size: 100,
    Cell: ({ row }) => {
      const { name, namespace } = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{name}</span>
          {namespace && <Badge text={namespace} color="gray" />}
        </div>
      );
    }
  },
  {
    header: "Role",
    id: "role",
    size: 80,
    accessorFn: (row) => row.role
  },
  {
    header: "Subjects",
    id: "subjects",
    size: 150,
    Cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {summarizeSubjects(row.original.subjects).map((label) => (
          <span
            key={label}
            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
          >
            {label}
          </span>
        ))}
      </div>
    )
  },
  {
    header: "Rules",
    id: "constraints",
    size: 60,
    Cell: ({ row }) => {
      const count = row.original.constraints?.length ?? 0;
      return (
        <span className="text-sm text-gray-600">
          {count > 0 ? `${plural(count, "rule")} selected` : "All rules"}
        </span>
      );
    }
  },
  {
    header: "Status",
    id: "status",
    size: 60,
    Cell: ({ row }) => <RbacObjectStatus {...row.original} />
  },
  {
    header: "Created",
    id: "created",
    size: 40,
    accessorFn: (row) => row.created_at,
    Cell: MRTDateCell
  },
  {
    header: "Updated",
    id: "updated",
    size: 40,
    accessorFn: (row) => row.updated_at,
    Cell: MRTDateCell
  },
  {
    header: "Created By",
    id: "createdBy",
    size: 40,
    Cell: ({ row }) => {
      const { created_by, source, id } = row.original;
      if (source !== "UI") {
        return <CRDSource source={source} id={id} showMinimal />;
      }
      return <Avatar user={created_by} />;
    }
  }
];

type RoleBindingsTableProps = {
  data: RoleBindingDisplay[];
  isLoading: boolean;
  handleRowClick?: (row: RoleBindingDisplay) => void;
};

export default function RoleBindingsTable({
  data,
  isLoading,
  handleRowClick = () => {}
}: RoleBindingsTableProps) {
  return (
    <MRTDataTable
      columns={roleBindingsTableColumns}
      data={data}
      isLoading={isLoading}
      onRowClick={handleRowClick}
    />
  );
}
