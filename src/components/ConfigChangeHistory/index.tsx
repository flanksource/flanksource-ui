import { ColumnDef } from "@tanstack/table-core";
import { useState } from "react";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { ConfigTypeChanges } from "../ConfigChanges";
import ConfigLink from "../ConfigLink/ConfigLink";

import { DateCell } from "../ConfigViewer/columns";
import { PaginationOptions } from "../DataTable";
import { DataTable, Icon } from "../index";
import { ConfigDetailChangeModal } from "../ConfigDetailsChanges/ConfigDetailsChanges";
import { useGetConfigChangesByConfigChangeIdQuery } from "../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";

const columns: ColumnDef<ConfigTypeChanges>[] = [
  {
    header: "Type",
    accessorKey: "change_type",
    cell: function ConfigChangeTypeCell({ row, column }) {
      const changeType = row?.getValue(column.id) as string;
      return (
        <div className="text-ellipsis overflow-hidden">
          <Icon
            name={changeType}
            secondary="diff"
            className="w-5 h-auto pr-1"
          />
          {changeType}
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

const configLinkCol: ColumnDef<ConfigTypeChanges>[] = [
  {
    header: "Catalog",
    accessorKey: "config_id",
    cell: function ConfigLinkCell({ row, column }) {
      const config = row.original.config;
      if (!config) {
        return null;
      }
      return (
        <ConfigLink
          configId={config.id}
          configName={config.name}
          configType={config.type}
          configTypeSecondary={config.config_class}
        />
      );
    },
    size: 84
  }
];

type ConfigChangeHistoryProps = {
  data: ConfigTypeChanges[];
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
    useState<ConfigTypeChanges>();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { data: configChange } = useGetConfigChangesByConfigChangeIdQuery(
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
