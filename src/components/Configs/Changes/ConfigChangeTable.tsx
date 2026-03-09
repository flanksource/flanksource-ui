import { useGetConfigChangesById } from "@flanksource-ui/api/query-hooks/useGetConfigChangesByConfigChangeIdQuery";
import { ConfigChange } from "@flanksource-ui/api/types/configs";
import GetUserAvatar from "@flanksource-ui/components/Users/GetUserAvatar";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { Age } from "@flanksource-ui/ui/Age";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { CellContext } from "@tanstack/react-table";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import ConfigLink from "../ConfigLink/ConfigLink";
import MRTConfigListTagsCell from "../ConfigList/Cells/MRTConfigListTagsCell";
import { ConfigDetailChangeModal } from "./ConfigDetailsChanges/ConfigDetailsChanges";

export const paramsToReset = {
  configChanges: ["pageIndex", "pageSize"]
};

const CHANGE_ID_SEARCH_PARAM = "changeId";

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
          (x{count} over <Age format={"short"} from={firstObserved} />)
        </span>
      )}
    </div>
  );
}

const configChangesColumn = (
  paramPrefix?: string
): MRT_ColumnDef<ConfigChange>[] => [
  {
    header: "Last Seen",
    id: "created_at",
    enableSorting: true,
    accessorKey: "created_at",
    meta: {
      cellClassName: "text-ellipsis overflow-hidden"
    },
    maxSize: 160,
    Cell: ({ cell, row, column }) => {
      const dateString = row?.getValue<string>(column.id);
      const firstObserved = row?.original.first_observed;
      const count = row.original.count;

      return (
        <div className="text-xs">
          <Age from={dateString} suffix={true} />
          {(count || 1) > 1 && (
            <span className="inline-block pl-1 text-gray-500">
              (x{count} over <Age format={"short"} from={firstObserved} />)
            </span>
          )}
        </div>
      );
    }
  },
  {
    header: "Catalog",
    id: "config_id",
    accessorKey: "config_id",
    enableHiding: true,
    enableSorting: false,
    Cell: ({ row }) => {
      const configId = row.original.config_id;
      return (
        <FilterByCellValue
          filterValue={configId}
          paramKey="id"
          paramsToReset={paramsToReset.configChanges}
          paramPrefix={paramPrefix}
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
    Cell: function ConfigChangeTypeCell({ row, column }) {
      const changeType = row?.getValue(column.id) as string;
      return (
        <FilterByCellValue
          filterValue={changeType}
          paramKey="changeType"
          paramsToReset={paramsToReset.configChanges}
          paramPrefix={paramPrefix}
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
    Cell: ({ cell }) => {
      const summary = cell.getValue<string>();

      return (
        <FilterByCellValue
          filterValue={summary}
          paramKey="summary"
          paramsToReset={paramsToReset.configChanges}
          paramPrefix={paramPrefix}
        >
          {summary}
        </FilterByCellValue>
      );
    }
  },
  {
    header: "Tags",
    accessorKey: "tags",
    Cell: (props) => (
      <MRTConfigListTagsCell
        {...props}
        enableFilterByTag
        paramPrefix={paramPrefix}
      />
    ),
    size: 100
  },
  {
    header: "Created By",
    size: 100,
    enableSorting: false,
    Cell: ({ row }) => {
      const userID = row.original.created_by;
      if (userID) {
        return (
          <FilterByCellValue
            filterValue={userID}
            paramKey="created_by"
            paramsToReset={paramsToReset.configChanges}
            paramPrefix={paramPrefix}
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
            paramPrefix={paramPrefix}
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
            paramPrefix={paramPrefix}
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
  isRefetching?: boolean;
  totalRecords: number;
  numberOfPages: number;
  paramPrefix?: string;
};

export function ConfigChangeTable({
  data,
  isLoading,
  isRefetching,
  totalRecords,
  numberOfPages,
  paramPrefix
}: ConfigChangeTableProps) {
  const columns = useMemo(
    () => configChangesColumn(paramPrefix),
    [paramPrefix]
  );
  const [params, setParams] = usePrefixedSearchParams(paramPrefix, false);

  const selectedChangeId = params.get(CHANGE_ID_SEARCH_PARAM) ?? undefined;

  const selectedConfigChange = useMemo(
    () => data.find((change) => change.id === selectedChangeId),
    [data, selectedChangeId]
  );

  const { data: configChange, isLoading: changeLoading } =
    useGetConfigChangesById(selectedChangeId ?? "", {
      enabled: !!selectedChangeId
    });

  const changeDetails = configChange ?? selectedConfigChange;

  return (
    <>
      <MRTDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isRefetching={isRefetching}
        enableServerSideSorting
        totalRowCount={totalRecords}
        manualPageCount={numberOfPages}
        enableServerSidePagination
        disableHiding
        onRowClick={(row) => {
          setParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams);
            nextParams.set(CHANGE_ID_SEARCH_PARAM, row.id);
            return nextParams;
          });
        }}
        urlParamPrefix={paramPrefix}
      />
      {selectedChangeId && changeDetails && (
        <ConfigDetailChangeModal
          isLoading={changeLoading}
          open={!!selectedChangeId}
          setOpen={(open) => {
            if (open) {
              return;
            }

            setParams((currentParams) => {
              const nextParams = new URLSearchParams(currentParams);
              nextParams.delete(CHANGE_ID_SEARCH_PARAM);
              return nextParams;
            });
          }}
          changeDetails={changeDetails}
        />
      )}
    </>
  );
}
