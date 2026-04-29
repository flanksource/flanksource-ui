import {
  DebugProperty,
  FeatureFlag
} from "@flanksource-ui/services/permissions/permissionsService";
import { nanosecondsToHuman } from "@flanksource-ui/utils/date";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { CellContext, ColumnDef } from "@tanstack/table-core";
import clsx from "clsx";
import { useMemo } from "react";

type FeatureFlagWithDefault = FeatureFlag & {
  defaultValue?: string;
};

type FeatureFlagsListProps = {
  data: FeatureFlag[];
  debugProperties?: Record<string, DebugProperty>;
  isLoading?: boolean;
  onRowClick?: (data: FeatureFlag) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "data">;

const DateCell = ({ getValue }: CellContext<FeatureFlagWithDefault, any>) => {
  const val = getValue();
  if (!val) return null;
  return <Age from={val} />;
};

const AvatarCell = ({ getValue }: CellContext<FeatureFlagWithDefault, any>) => {
  return <Avatar user={getValue()} circular />;
};

const TypeBadge = ({ type }: { type?: string }) => {
  if (!type) return null;
  const colours: Record<string, string> = {
    bool: "bg-green-100 text-green-800",
    int: "bg-blue-100 text-blue-800",
    duration: "bg-purple-100 text-purple-800",
    string: "bg-gray-100 text-gray-700"
  };
  return (
    <span
      className={clsx(
        "rounded px-1.5 py-0.5 text-xs font-medium",
        colours[type] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {type}
    </span>
  );
};

const ValueCell = ({
  row,
  getValue
}: CellContext<FeatureFlagWithDefault, any>) => {
  const value = getValue();
  const type = row.original.type;

  if (type === "bool") {
    const isTrue = value === "true" || value === true;
    return (
      <span
        className={clsx(
          "rounded px-1.5 py-0.5 text-xs font-medium",
          isTrue ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
        )}
      >
        {isTrue ? "true" : "false"}
      </span>
    );
  }

  if (type === "duration") {
    const human = nanosecondsToHuman(value);
    return <span>{human || value}</span>;
  }

  return <span>{value}</span>;
};

const DefaultValueCell = ({
  getValue,
  row
}: CellContext<FeatureFlagWithDefault, any>) => {
  const raw = getValue() as string | undefined;
  if (raw === undefined || raw === null) return null;
  const type = row.original.type;
  if (type === "duration") {
    return (
      <span className="text-gray-500">{nanosecondsToHuman(raw) || raw}</span>
    );
  }
  return <span className="text-gray-500">{raw}</span>;
};

const columns: ColumnDef<FeatureFlagWithDefault>[] = [
  {
    header: "Name",
    accessorKey: "name",
    minSize: 300
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ getValue }) => <TypeBadge type={getValue() as string} />,
    maxSize: 90
  },
  {
    header: "Value",
    accessorKey: "value",
    cell: ValueCell
  },
  {
    header: "Default",
    accessorKey: "defaultValue",
    cell: DefaultValueCell
  },
  {
    header: "Source",
    accessorKey: "source",
    maxSize: 80
  },
  {
    header: "Created By",
    accessorKey: "created_by",
    cell: AvatarCell,
    maxSize: 80
  },
  {
    header: "Updated At",
    accessorKey: "updated_at",
    cell: DateCell,
    maxSize: 120,
    sortingFn: "datetime"
  }
];

function getGroupKey(name: string): string {
  const firstDot = name.indexOf(".");
  return firstDot === -1 ? name : name.slice(0, firstDot);
}

type GroupedSectionProps = {
  group: string;
  rows: FeatureFlagWithDefault[];
  isLoading?: boolean;
  onRowClick?: (data: FeatureFlag) => void;
};

function GroupedSection({
  group,
  rows,
  isLoading,
  onRowClick
}: GroupedSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 px-1 text-sm font-semibold capitalize text-gray-600">
        {group}
      </h3>
      <DataTable
        stickyHead
        columns={columns}
        data={rows}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        preferencesKey={`feature-flags-${group}`}
        savePreferences={false}
        handleRowClick={(row) => {
          onRowClick?.(row.original);
        }}
      />
    </div>
  );
}

export function FeatureFlagsList({
  data,
  debugProperties,
  isLoading,
  className,
  onRowClick,
  ...rest
}: FeatureFlagsListProps) {
  const enrichedData = useMemo<FeatureFlagWithDefault[]>(() => {
    return data.map((flag) => {
      const debug = debugProperties?.[flag.name];
      return {
        ...flag,
        defaultValue: debug !== undefined ? String(debug.default) : undefined
      };
    });
  }, [data, debugProperties]);

  const groups = useMemo(() => {
    const map = new Map<string, FeatureFlagWithDefault[]>();
    for (const flag of enrichedData) {
      const key = getGroupKey(flag.name);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(flag);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [enrichedData]);

  return (
    <div className={clsx(className, "overflow-y-auto")} {...rest}>
      {groups.map(([group, rows]) => (
        <GroupedSection
          key={group}
          group={group}
          rows={rows}
          isLoading={isLoading}
          onRowClick={onRowClick}
        />
      ))}
    </div>
  );
}
