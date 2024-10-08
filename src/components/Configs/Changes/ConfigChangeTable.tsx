import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import GetUserAvatar from "@flanksource-ui/components/Users/GetUserAvatar";
import { Age } from "@flanksource-ui/ui/Age";
import { DataTable, PaginationOptions } from "@flanksource-ui/ui/DataTable";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { CellContext } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import React, { useState } from "react";
import ConfigLink from "../ConfigLink/ConfigLink";
import ConfigListTagsCell from "../ConfigList/Cells/ConfigListTagsCell";
import { ConfigSummaryAnalysisCell } from "../ConfigSummary/ConfigSummaryList";
import { ConfigDetailChangeModal } from "./ConfigDetailsChanges/ConfigDetailsChanges";

export const paramsToReset = {
  configChanges: ["pageIndex", "pageSize"]
};

export function ConfigChangeDateCell({
  row,
  column
}: CellContext<ConfigChange, any>) {
  const dateString = row?.getValue<string>(column.id);
  const firstObserved = row?.original.first_observed;
  const count = row.original.count;

  return (
    <div className="text-xs">
      <Age from={dateString} />
      {(count || 1) > 1 && (
        <span className="inline-block pl-1 text-gray-500">
          (x{count} over <Age from={firstObserved} />)
        </span>
      )}
    </div>
  );
}

const configChangesColumn: ColumnDef<ConfigChange>[] = [
  {
    header: "Last Seen",
    id: "created_at",
    enableSorting: true,
    accessorKey: "created_at",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    maxSize: 70,
    cell: ConfigChangeDateCell
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
    minSize: 50,
    maxSize: 250
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
          <div className="space-x-1 overflow-hidden text-ellipsis">
            <ChangeIcon change={row.original} />
            <span>{changeType}</span>
          </div>
        </FilterByCellValue>
      );
    },
    minSize: 50,
    maxSize: 100
  },
  {
    header: "Summary",
    accessorKey: "summary",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    maxSize: 500,
    minSize: 250,
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
    header: "Tags",
    accessorKey: "tags",
    cell: React.memo((props) => (
      <ConfigListTagsCell {...props} enableFilterByTag />
    )),
    aggregatedCell: "",
    size: 100
  },
  {
    header: "Created By",
    size: 100,
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

type ConfigChangeTableProps = {
  data: ConfigChange[];
  isLoading?: boolean;
  className?: string;
  tableStyle?: React.CSSProperties;
  pagination?: PaginationOptions;
};

export function ConfigChangeTable({
  data,
  isLoading,
  className = "table-auto table-fixed",
  pagination,
  tableStyle
}: ConfigChangeTableProps) {
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
        columns={configChangesColumn}
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
