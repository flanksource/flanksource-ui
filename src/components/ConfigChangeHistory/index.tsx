import { ColumnDef } from "@tanstack/table-core";
import { useState } from "react";
import { useGetConfigChangesById } from "../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigDetailChangeModal } from "../ConfigDetailsChanges/ConfigDetailsChanges";
import ConfigLink from "../ConfigLink/ConfigLink";
import { PaginationOptions } from "../DataTable";
import { ChangeIcon } from "../Icon/ChangeIcon";
import { DataTable } from "../index";
import { ConfigChange } from "../../api/types/configs";
import { DateCell } from "../../ui/table";

const columns: ColumnDef<ConfigChange>[] = [
  {
    header: "Type",
    accessorKey: "change_type",
    cell: function ConfigChangeTypeCell({ row, column }) {
      const changeType = row?.getValue(column.id) as string;
      return (
        <div className="text-ellipsis overflow-hidden">
          <ChangeIcon change={row.original} className="w-5 pr-1" />
          <span>{changeType}</span>
        </div>
      );
    },
    size: 48
  },
  {
    header: "Summary",
    accessorKey: "summary",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    }
  },
  {
    header: "Source",
    accessorKey: "source",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    size: 48
  },
  {
    header: "Created",
    accessorKey: "created_at",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    size: 36,
    cell: DateCell
  }
];

const configLinkCol: ColumnDef<ConfigChange>[] = [
  {
    header: "Catalog",
    accessorKey: "config_id",
    cell: function ConfigLinkCell({ row, column }) {
      const config = row.original.config;
      if (!config) {
        return null;
      }
      return <ConfigLink config={config} />;
    },
    size: 84
  }
];

type ConfigChangeHistoryProps = {
  data: ConfigChange[];
  isLoading?: boolean;
  linkConfig?: boolean;
  className?: string;
  tableStyle?: React.CSSProperties;
  pagination?: PaginationOptions;
};

export function ConfigChangeHistory({
  data,
  isLoading,
  linkConfig,
  className = "w-full",
  pagination,
  tableStyle
}: ConfigChangeHistoryProps) {
  const [selectedConfigChange, setSelectedConfigChange] =
    useState<ConfigChange>();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { data: configChange } = useGetConfigChangesById(
    selectedConfigChange?.id!,
    selectedConfigChange?.config_id!,
    {
      enabled: !!selectedConfigChange
    }
  );

  return (
    <>
      <DataTable
        className={className}
        columns={linkConfig ? [...configLinkCol, ...columns] : columns}
        data={data}
        isLoading={isLoading}
        stickyHead
        isVirtualized={false}
        tableStyle={tableStyle}
        pagination={pagination}
        virtualizedRowEstimatedHeight={500}
        preferencesKey="config-change-history"
        savePreferences={false}
        handleRowClick={(row) => {
          setSelectedConfigChange(row.original);
          setModalIsOpen(true);
        }}
      />
      {configChange && (
        <ConfigDetailChangeModal
          open={modalIsOpen}
          setOpen={setModalIsOpen}
          changeDetails={configChange}
        />
      )}
    </>
  );
}
