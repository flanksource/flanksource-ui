import { FeatureFlag } from "@flanksource-ui/services/permissions/permissionsService";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { PropertyGroup } from "@flanksource-ui/utils/propertyGrouping";
import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

type FeatureFlagsGroupedListProps = {
  groups: PropertyGroup[];
  isLoading?: boolean;
  onRowClick?: (data: FeatureFlag) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const DateCell = ({ getValue }: CellContext<FeatureFlag, any>) => (
  <Age from={getValue()} />
);

const AvatarCell = ({ getValue }: CellContext<FeatureFlag, any>) => {
  return <Avatar user={getValue()} circular />;
};

const columns: ColumnDef<FeatureFlag>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Description",
    accessorKey: "description"
  },
  {
    header: "Value",
    accessorKey: "value"
  },
  {
    header: "Type",
    accessorKey: "type"
  },
  {
    header: "Default",
    accessorKey: "default",
    cell: ({ getValue }) => {
      const value = getValue();
      if (value === undefined || value === null || value === "") {
        return "-";
      }
      return String(value);
    }
  },
  {
    header: "Source",
    accessorKey: "source"
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    cell: AvatarCell
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: DateCell,
    sortingFn: "datetime"
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    cell: DateCell,
    sortingFn: "datetime"
  }
];

export function FeatureFlagsGroupedList({
  groups,
  isLoading,
  className,
  onRowClick,
  ...rest
}: FeatureFlagsGroupedListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(groups.map((g) => g.name))
  );

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  return (
    <div className={clsx(className, "overflow-y-auto")} {...rest}>
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.name);
        return (
          <div key={group.name} className="mb-4">
            <button
              className="mb-2 flex w-full items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-left font-semibold hover:bg-gray-200"
              onClick={() => toggleGroup(group.name)}
            >
              {isExpanded ? (
                <FaChevronDown className="text-gray-600" />
              ) : (
                <FaChevronRight className="text-gray-600" />
              )}
              <span>
                {group.name} ({group.properties.length})
              </span>
            </button>
            {isExpanded && (
              <DataTable
                stickyHead
                columns={columns}
                data={group.properties}
                tableStyle={{ borderSpacing: "0" }}
                isLoading={isLoading}
                preferencesKey="feature-flags-grouped-list"
                savePreferences={false}
                handleRowClick={(row) => {
                  onRowClick?.(row.original);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
