import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { BiDollarCircle } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { GrIntegration, GrWorkshop } from "react-icons/gr";
import { ImHeartBroken } from "react-icons/im";
import {
  IoMdArrowDropdown,
  IoMdArrowDropright,
  IoMdSpeedometer
} from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { DataTable, Icon } from "../";
import { ConfigItem } from "../../api/services/configs";
import { FormatCurrency } from "../ConfigCosts";
import {
  getTimeBucket,
  relativeDateTime,
  TIME_BUCKETS
} from "../../utils/date";
import {
  CellContext,
  ColumnDef,
  Row,
  SortingState
} from "@tanstack/react-table";

interface Analysis {
  analysis_type: string;
  analyzer: string;
  severity: string;
}

const columns: ColumnDef<ConfigItem, any>[] = [
  {
    header: "Type",
    id: "config_type",
    cell: TypeCell,
    aggregatedCell: "",
    accessorKey: "config_type",
    size: 250,
    enableGrouping: true
  },
  {
    header: "Name",
    accessorKey: "name",
    aggregatedCell: "",
    size: 350,
    enableGrouping: true
  },
  {
    header: "Changes",
    accessorKey: "changes",
    id: "changes",
    cell: React.memo(ChangeCell),
    enableGrouping: true,
    aggregationFn: changeAggregationFN,
    aggregatedCell: ({ getValue }: CellContext<ConfigItem, any>) => {
      const value = getValue();
      if (!value) {
        return "";
      }
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      );
    },
    size: 150,
    meta: {
      cellClassName: "overflow-hidden"
    },
    enableSorting: false
  },
  {
    header: "Analysis",
    accessorKey: "analysis",
    cell: AnalysisCell,
    aggregatedCell: "",
    size: 120
  },
  {
    header: "Cost (per min)",
    accessorKey: "cost_per_minute",
    cell: CostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Cost (24hr)",
    accessorKey: "cost_total_1d",
    cell: CostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Cost (7d)",
    accessorKey: "cost_total_7d",
    cell: CostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Cost (30d)",
    accessorKey: "cost_total_30d",
    cell: CostCell,
    aggregationFn: "sum",
    aggregatedCell: CostAggregate,
    size: 50
  },
  {
    header: "Tags",
    accessorKey: "tags",
    cell: React.memo(TagsCell),
    aggregatedCell: "",
    size: 250,
    meta: {
      cellClassName: "overflow-hidden"
    }
  },
  {
    header: "All Tags",
    accessorKey: "allTags",
    cell: React.memo((props) => <TagsCell {...props} hideGroupByView />),
    aggregatedCell: "",
    size: 250,
    meta: {
      cellClassName: "overflow-hidden"
    }
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: DateCell,
    aggregatedCell: "",
    size: 80
  },
  {
    header: "Last Updated",
    accessorKey: "updated_at",
    cell: DateCell,
    aggregatedCell: "",
    size: 90
  },
  {
    header: "Changed",
    accessorFn: changeColumnAccessorFN,
    id: "changed",
    sortingFn: changeColumnSortingFN,
    size: 180
  }
];

const MIN_ITEMS = 2;

function TagsCell({
  getValue,
  hideGroupByView = false
}: CellContext<ConfigItem, any> & {
  hideGroupByView?: boolean;
}): JSX.Element | null {
  const [showMore, setShowMore] = useState(false);
  const [params] = useSearchParams();

  const tagMap = getValue<ConfigItem["tags"]>() || {};
  const tagKeys = Object.keys(tagMap)
    .sort()
    .filter((key) => key !== "toString");
  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (tagKeys.length === 0) {
    return null;
  }

  if (!hideGroupByView && groupByProp) {
    if (!tagMap[groupByProp]) {
      return null;
    }

    return (
      <div className="font-mono flex flex-wrap w-full max-w-full pl-1 space-y-1">
        <div
          data-tip={`${groupByProp}: ${tagMap[groupByProp]}`}
          className="max-w-full overflow-hidden text-ellipsis bg-gray-200 border border-gray-300 px-1 py-0.75 mr-1 rounded-md text-gray-600 font-semibold text-xs"
          key={groupByProp}
        >
          {groupByProp}:{" "}
          <span className="font-light">{tagMap[groupByProp]}</span>
        </div>
      </div>
    );
  }

  const renderKeys = showMore ? tagKeys : tagKeys.slice(0, MIN_ITEMS);

  return (
    <div
      onClick={(e) => {
        /* Don't trigger click for parent. E.g without stopPropagation,
           handleRowClick would be called. */
        e.stopPropagation();
        setShowMore((showMore) => !showMore);
      }}
      className="flex items-start"
    >
      {tagKeys.length > MIN_ITEMS && (
        <button className="text-sm focus:outline-none">
          {showMore ? (
            <IoMdArrowDropdown size={24} />
          ) : (
            <IoMdArrowDropright size={24} />
          )}
        </button>
      )}

      <div className="font-mono flex flex-wrap flex-1 max-w-full pl-1 space-y-1">
        {renderKeys.map((key) => (
          <div
            data-tip={`${key}: ${tagMap[key]}`}
            className="max-w-full overflow-hidden text-ellipsis bg-gray-200 border border-gray-300 px-1 py-0.75 mr-1 rounded-md text-gray-600 font-semibold text-xs"
            key={key}
          >
            {key}: <span className="font-light">{tagMap[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangeCell({ row, column }: CellContext<ConfigItem, any>) {
  const [showMore, setShowMore] = useState(false);

  const changes = row?.getValue<ConfigItem["changes"]>(column.id);

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (changes == null) {
    return null;
  }

  const renderKeys = showMore ? changes : changes.slice(0, MIN_ITEMS);

  const cell = renderKeys.map((item: any, index: number) => {
    return (
      <div className="flex flex-row max-w-full overflow-hidden" key={index}>
        <div className="flex max-w-full items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 overflow-hidden">
          {item.change_type === "diff" ? (
            item.total
          ) : (
            <div
              data-tip={`${item.change_type}: ${item.total}`}
              className="flex flex-row max-w-full space-x-1"
            >
              <div className="text-ellipsis overflow-hidden">
                {item.change_type}
              </div>
              :<div className="flex-1"> {item.total}</div>
            </div>
          )}
        </div>
      </div>
    );
  });
  return (
    <div
      className="flex flex-row items-start"
      onClick={(e) => {
        if (changes.length > MIN_ITEMS) {
          e.stopPropagation();
          setShowMore((showMore) => !showMore);
        }
      }}
    >
      {changes.length > MIN_ITEMS && (
        <button className="text-sm focus:outline-none">
          {showMore ? (
            <IoMdArrowDropdown size={24} />
          ) : (
            <IoMdArrowDropright size={24} />
          )}
        </button>
      )}
      <div className="flex flex-col flex-1 w-full max-w-full">{cell}</div>
    </div>
  );
}

function TypeCell({ row, column, getValue }: CellContext<ConfigItem, unknown>) {
  const name = row.getIsGrouped()
    ? row.subRows[0]?.original.external_type
    : row.original.external_type;
  const secondary = row.getIsGrouped()
    ? row.subRows[0]?.original.config_type
    : row.original.config_type;

  return (
    <span className="flex flex-nowrap">
      <Icon name={name} secondary={secondary} />
      <span className="pl-1"> {getValue<ConfigItem["config_type"]>()}</span>
    </span>
  );
}

function AnalysisIcon({ analysis }: { analysis: Analysis }) {
  let color = "44403c";

  if (analysis.severity === "critical") {
    color = "#f87171";
  } else if (analysis.severity === "warning") {
    color = "#fb923c";
  } else if (analysis.severity === "info") {
    color = "#44403c";
  }

  switch (analysis.analysis_type) {
    case "cost":
      return <BiDollarCircle color={color} size="20" title="Cost" />;
    case "availability":
      return <ImHeartBroken color={color} size="20" title="Availability" />;
    case "performance":
      return <IoMdSpeedometer color={color} size="20" title="Performance" />;
    case "security":
      return <MdSecurity color={color} size="20" title="Security" />;
    case "integration":
      return <GrIntegration color={color} size="20" title="Integration" />;
    case "compliance":
      return <FaTasks color={color} size="20" title="Compliance" />;
    case "technicalDebt":
      return <GrWorkshop color={color} size="20" title="Technical Debt" />;
  }
  return <AiFillWarning color={color} size="20" />;
}

function AnalysisCell({ row, column }: CellContext<ConfigItem, unknown>) {
  const analysis = row?.getValue<ConfigItem["analysis"]>(column.id) || [];

  useEffect(() => {
    if (analysis.length > 0) {
      ReactTooltip.rebuild();
    }
  });

  if (analysis.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full max-w-full">
      {analysis.map((item, index) => (
        <div
          data-tip={`${item.analyzer}`}
          className="flex flex-row space-x-2 pb-0.5 max-w-full"
          key={index}
        >
          <span className="w-auto">
            <AnalysisIcon analysis={item} />
          </span>
          <span className="flex-1 overflow-hidden overflow-ellipsis">
            {item.analyzer}
          </span>
        </div>
      ))}
    </div>
  );
}

function CostCell({ getValue }: CellContext<ConfigItem, any>) {
  const cost = getValue<string | number>();
  if (!cost || parseFloat((cost as number).toFixed(2)) === 0) {
    return null;
  }
  return <FormatCurrency value={cost} />;
}

function DateCell({ getValue }: CellContext<ConfigItem, any>) {
  const dateString = getValue();
  if (dateString === "0001-01-01T00:00:00") {
    return null;
  }
  return (
    <div className="text-xs">
      {dateString ? relativeDateTime(dateString) : ""}
    </div>
  );
}

function changeAggregationFN(
  columnId: string,
  leafRows: Row<ConfigItem>[],
  childRows: Row<ConfigItem>[]
) {
  let sum = 0;
  leafRows?.forEach((row) => {
    const values = row.getValue<{ total: number }[]>(columnId);
    if (values) {
      sum += values.reduce((acc, val) => acc + val.total, 0);
    }
  });
  return sum;
}

function CostAggregate({ getValue }: CellContext<ConfigItem, any>) {
  const value = getValue<ConfigItem["cost_per_minute"]>();
  return !value || parseFloat(value.toFixed(2)) === 0 ? (
    ""
  ) : (
    <FormatCurrency value={value} />
  );
}

function changeColumnAccessorFN(row: any) {
  return getTimeBucket(row.updated_at);
}

function changeColumnSortingFN(rowA: any, rowB: any, columnId: string) {
  const rowAOrder =
    Object.values(TIME_BUCKETS).find((tb) => tb.name === rowA.values[columnId])
      ?.sortOrder || 0;
  const rowBOrder =
    Object.values(TIME_BUCKETS).find((tb) => tb.name === rowB.values[columnId])
      ?.sortOrder || 0;
  if (rowAOrder >= rowBOrder) {
    return 1;
  } else {
    return -1;
  }
}

export interface Props {
  data: ConfigItem[];
  handleRowClick: (row?: any) => void;
  isLoading: boolean;
}

function ConfigList({ data, handleRowClick, isLoading }: Props) {
  const [queryParams] = useSearchParams({
    sortBy: "config_type",
    sortOrder: "asc",
    groupBy: "config_type"
  });

  const groupByField = queryParams.get("groupBy") || "config_type";
  const sortField = queryParams.get("sortBy");

  const isSortOrderDesc =
    queryParams.get("sortOrder") === "desc" ? true : false;

  const [sortBy, setSortBy] = useState<SortingState>(() => {
    return sortField
      ? [
          {
            id: sortField,
            desc: isSortOrderDesc
          },
          {
            id: "name",
            desc: isSortOrderDesc
          }
        ]
      : [];
  });

  const setHiddenColumns = useCallback(() => {
    if (groupByField !== "changed" && groupByField !== "tags") {
      return ["changed", "allTags"];
    } else if (groupByField === "tags") {
      return ["changed"];
    }
    return [];
  }, [groupByField]);

  return (
    <DataTable
      stickyHead
      isVirtualized
      columns={columns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      groupBy={
        !groupByField || groupByField === "no_grouping"
          ? undefined
          : [groupByField]
      }
      hiddenColumns={setHiddenColumns()}
      className="max-w-full overflow-x-auto"
      tableSortByState={sortBy}
      onTableSortByChanged={(newSortBy) => {
        const sortByValue =
          typeof newSortBy === "function" ? newSortBy(sortBy) : newSortBy;
        if (sortByValue.length > 0) {
          const { id, desc } = sortByValue[0];
          if (id === "config_type") {
            setSortBy([
              {
                id: "config_type",
                desc: desc
              },
              {
                id: "name",
                desc: desc
              }
            ]);
          } else {
            setSortBy(sortByValue);
          }
        }
      }}
    />
  );
}

export default ConfigList;
