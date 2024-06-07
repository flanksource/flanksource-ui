import { HealthCheck } from "@flanksource-ui/api/types/health";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../../ui/Icons/Icon";

type CheckRelationshipsComponent = {
  relationship: "component";
  name: string;
  id: string;
  icon?: string;
};

type CheckRelationshipsConfig = {
  relationship: "config";
  name: string;
  id: string;
  type?: string;
};

type CheckRelationshipsRow =
  | CheckRelationshipsComponent
  | CheckRelationshipsConfig;

const columns: ColumnDef<CheckRelationshipsRow>[] = [
  {
    id: "Name",
    header: "Name",
    cell: ({ row }) => {
      const { name } = row.original;
      const icon =
        row.original.relationship === "component"
          ? row.original.icon
          : row.original.type;

      return (
        <div className="flex items-center">
          {icon && (
            <Icon name={icon} className="mr-2 h-5 w-5 " secondary={name} />
          )}
          {name}
        </div>
      );
    }
  },
  {
    id: "Type",
    header: "Type",
    cell: ({ row }) => {
      const { relationship } = row.original;
      return relationship === "config" ? "Config" : "Component";
    }
  }
];

type CheckRelationshipsProps = {
  check: Partial<HealthCheck>;
};

export default function CheckRelationships({ check }: CheckRelationshipsProps) {
  const navigate = useNavigate();

  const items = useMemo(() => {
    const combined: CheckRelationshipsRow[] = [
      ...(check.components
        ? check.components?.map((component) => ({
            relationship: "component" as const,
            name: component.components.name,
            id: component.components.id,
            icon: component.components.icon
          }))
        : []),
      ...(check.configs
        ? check.configs?.map((config) => ({
            relationship: "config" as const,
            name: config.configs.name,
            id: config.configs.id,
            type: config.configs.type
          }))
        : [])
    ];
    return combined;
  }, [check.components, check.configs]);

  const handleRowClick = (row: CheckRelationshipsRow) => {
    if (row.relationship === "component") {
      navigate(`/topology/${row.id}`);
    } else {
      navigate(`/catalog/${row.id}`);
    }
  };

  if (!check || items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <DataTable
        handleRowClick={(row) => handleRowClick(row.original)}
        columns={columns}
        data={items}
      />
    </div>
  );
}
