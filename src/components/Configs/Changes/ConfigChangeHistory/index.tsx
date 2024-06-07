import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import GetUserAvatar from "@flanksource-ui/components/Users/GetUserAvatar";
import { PaginationOptions } from "@flanksource-ui/ui/DataTable";
import { DateCell } from "@flanksource-ui/ui/DataTable/Cells/DateCells";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { ColumnDef } from "@tanstack/table-core";
import { useState } from "react";
import { ChangeIcon } from "../../../../ui/Icons/ChangeIcon";
import { DataTable } from "../../../index";
import ConfigLink from "../../ConfigLink/ConfigLink";
import { ConfigDetailChangeModal } from "../ConfigDetailsChanges/ConfigDetailsChanges";

export const paramsToReset = {
  configChanges: ["pageIndex", "pageSize"]
};

const columns: ColumnDef<ConfigChange>[] = [
  {
    header: "Created",
    id: "created_at",
    enableSorting: true,
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
    enableSorting: false,
    cell: function ConfigLinkCell({ row }) {
      const configId = row.original.config_id;
      return (
        <FilterByCellValue
          filterValue={configId}
          paramKey="id"
          paramsToReset={paramsToReset.configChanges}
        >
          <ConfigLink
            config={row.original.config}
            configId={row.original.config_id}
          />
        </FilterByCellValue>
      );
    },
    size: 84
  },
  {
    header: "Type",
    accessorKey: "change_type",
    cell: function ConfigChangeTypeCell({ row, column }) {
      const changeType = row?.getValue(column.id) as string;
      return (
        <FilterByCellValue
          filterValue={changeType}
          paramKey="changeType"
          paramsToReset={paramsToReset.configChanges}
        >
          <div className="text-ellipsis overflow-hidden space-x-1">
            <ChangeIcon change={row.original} />
            <span>{changeType}</span>
          </div>
        </FilterByCellValue>
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
    maxSize: 150,
    cell: ({ getValue }) => {
      const summary = getValue<string>();

      return (
        <FilterByCellValue
          filterValue={summary}
          paramKey="summary"
          paramsToReset={paramsToReset.configChanges}
        >
          {summary}
        </FilterByCellValue>
      );
    }
  },
  {
    header: "Created By",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => {
      const userID = row.original.created_by;
      if (userID) {
        return (
          <FilterByCellValue
            filterValue={userID}
            paramKey="created_by"
            paramsToReset={paramsToReset.configChanges}
          >
            <GetUserAvatar userID={userID} />
          </FilterByCellValue>
        );
      }

      const externalCreatedBy = row.original.external_created_by;
      if (externalCreatedBy) {
        return (
          <FilterByCellValue
            filterValue={externalCreatedBy}
            paramKey="external_created_by"
            paramsToReset={paramsToReset.configChanges}
          >
            <span>{externalCreatedBy}</span>
          </FilterByCellValue>
        );
      }

      const source = row.original.source;
      if (source) {
        return (
          <FilterByCellValue
            filterValue={source}
            paramKey="source"
            paramsToReset={paramsToReset.configChanges}
          >
            <span>{source}</span>
          </FilterByCellValue>
        );
      }

      return null;
    }
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
  className = "table-auto table-fixed",
  pagination,
  tableStyle
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

  const [sortBy, onTableSortByChanged] = useReactTableSortState();

  return (
    <>
      <DataTable
        className={className}
        columns={columns}
        hiddenColumns={linkConfig ? [] : ["config_id"]}
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
        onTableSortByChanged={onTableSortByChanged}
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
