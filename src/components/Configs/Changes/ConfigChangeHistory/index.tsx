import { SortingState, Updater } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { useState } from "react";
import { useGetConfigChangesById } from "../../../../api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "../../../../api/types/configs";
import { DateCell } from "../../../../ui/table";
import { PaginationOptions } from "../../../DataTable";
import { ChangeIcon } from "../../../Icon/ChangeIcon";
import { DataTable } from "../../../index";
import ConfigLink from "../../ConfigLink/ConfigLink";
import { ConfigDetailChangeModal } from "../ConfigDetailsChanges/ConfigDetailsChanges";

const columns: ColumnDef<ConfigChange>[] = [
  {
    header: "Created",
    accessorKey: "created_at",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    maxSize: 20,
    cell: DateCell
  },
  {
    header: "Catalog",
    id: "config_id",
    accessorKey: "config_id",
    enableHiding: true,
    cell: function ConfigLinkCell({ row, column }) {
      const config = row.original.config_id;
      if (!config) {
        return null;
      }
      return <ConfigLink configId={config} />;
    },
    size: 84
  },
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
    maxSize: 70
  },
  {
    header: "Summary",
    accessorKey: "summary",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    maxSize: 150
  },
  {
    header: "Source",
    accessorKey: "source",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    size: 70
  }
];

type ConfigChangeHistoryProps = {
  data: ConfigChange[];
  isLoading?: boolean;
  linkConfig?: boolean;
  className?: string;
  tableStyle?: React.CSSProperties;
  pagination?: PaginationOptions;
  sortBy?: SortingState;
  setSortBy?: (sort: Updater<SortingState>) => void;
};

export function ConfigChangeHistory({
  data,
  isLoading,
  linkConfig,
  className = "table-auto table-fixed",
  pagination,
  tableStyle,
  sortBy,
  setSortBy = () => {}
}: ConfigChangeHistoryProps) {
  const [selectedConfigChange, setSelectedConfigChange] =
    useState<ConfigChange>();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { data: configChange, isLoading: changeLoading } =
    useGetConfigChangesById(
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
        columns={columns}
        hiddenColumns={linkConfig ? ["config_id"] : undefined}
        data={data}
        isLoading={isLoading}
        stickyHead
        isVirtualized={false}
        tableStyle={tableStyle}
        pagination={pagination}
        preferencesKey="config-change-history"
        savePreferences={false}
        enableServerSideSorting
        tableSortByState={sortBy}
        onTableSortByChanged={setSortBy}
        handleRowClick={(row) => {
          setSelectedConfigChange(row.original);
          setModalIsOpen(true);
        }}
      />
      {configChange && (
        <ConfigDetailChangeModal
          isLoading={changeLoading}
          open={modalIsOpen}
          setOpen={(open) => {
            setModalIsOpen(open);
          }}
          changeDetails={configChange}
        />
      )}
    </>
  );
}
