import React, { useEffect, useState } from "react";
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
import * as timeago from "timeago.js";
import { DataTable, Icon } from "../";
import { ConfigItem } from "../../api/services/configs";
import { FormatCurrency } from "../ConfigCosts";
import { getTimeBucket, TIME_BUCKETS } from "../../utils/date";

interface TableCols {
  Header: string;
  accessor: string | ((row: any, rowIndex: number) => any);
  cellClass?: string;
  Cell?: React.ComponentType<CellProp>;
  aggregate?: string | ((leafValues: any[], aggregatedValues?: any[]) => any);
  Aggregated?: string | ((values: any) => string | JSX.Element);
  id?: string;
  sortType?:
    | string
    | ((rowA: any, rowB: any, columnID: string, desc: boolean) => any);
  maxWidth?: number;
}
interface Analysis {
  analysis_type: string;
  analyzer: string;
  severity: string;
}

const columns: TableCols[] = [
  {
    Header: "Type",
    accessor: "config_type",
    Cell: TypeCell,
    Aggregated: ""
  },
  {
    Header: "Name",
    accessor: "name",
    Aggregated: ""
  },
  {
    Header: "Changes",
    accessor: "changes",
    Cell: React.memo(ChangeCell),
    aggregate: ChangeAggregate,
    Aggregated: ({ value }) => {
      if (!value) {
        return "";
      }
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      );
    },
    maxWidth: 400
  },
  {
    Header: "Analysis",
    accessor: "analysis",
    Cell: AnalysisCell,
    Aggregated: "",
    maxWidth: 400
  },
  {
    Header: "Cost (per min)",
    accessor: "cost_per_minute",
    Cell: CostCell,
    aggregate: "sum",
    Aggregated: CostAggregate
  },
  {
    Header: "Cost (24hr)",
    accessor: "cost_total_1d",
    Cell: CostCell,
    aggregate: "sum",
    Aggregated: CostAggregate
  },
  {
    Header: "Cost (7d)",
    accessor: "cost_total_7d",
    Cell: CostCell,
    aggregate: "sum",
    Aggregated: CostAggregate
  },
  {
    Header: "Cost (30d)",
    accessor: "cost_total_30d",
    Cell: CostCell,
    aggregate: "sum",
    Aggregated: CostAggregate
  },
  {
    Header: "Tags",
    accessor: "tags",
    Cell: React.memo(TagsCell),
    cellClass: "overflow-auto",
    Aggregated: "",
    maxWidth: 400
  },
  {
    Header: "All Tags",
    accessor: "allTags",
    Cell: ({ row, column }) => (
      <TagsCell row={row} column={column} hideGroupByView={true} />
    ),
    cellClass: "overflow-auto",
    Aggregated: "",
    maxWidth: 400
  },
  {
    Header: "Created",
    accessor: "created_at",
    Cell: DateCell,
    Aggregated: ""
  },
  {
    Header: "Last Updated",
    accessor: "updated_at",
    Cell: DateCell,
    Aggregated: ""
  },
  {
    Header: "Changed",
    accessor: ChangedAccessor,
    id: "changed",
    sortType: ChangedSorted
  }
];

interface CellProp {
  row: {
    values: { [index: string]: any };
    original: { [index: string]: any };
    isGrouped: boolean;
    subRows: any[];
  };
  column: { id: string };
}

const MIN_ITEMS = 2;

function TagsCell({
  row,
  column,
  hideGroupByView
}: CellProp & { hideGroupByView?: boolean }): JSX.Element | null {
  const [showMore, setShowMore] = useState(false);
  const [params] = useSearchParams();

  const tagMap = row?.values[column.id] || {};
  const tagKeys = Object.keys(tagMap)
    .sort()
    .filter((key) => key !== "toString");
  const groupByProp = decodeURIComponent(params.get("groupByProp") ?? "");

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (tagKeys.length === 0) {
    return <div className="flex"></div>;
  }

  if (!hideGroupByView && groupByProp) {
    if (!tagMap[groupByProp]) {
      return null;
    }

    return (
      <div className="font-mono flex flex-wrap w-96 max-w-[24rem] pl-1 space-y-1">
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

      <div className="font-mono flex flex-wrap w-96 max-w-[24rem] pl-1 space-y-1">
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

function ChangeCell({ row, column }: CellProp): JSX.Element {
  const [showMore, setShowMore] = useState(false);

  const changes = row?.values[column.id];

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (changes == null) {
    return <span></span>;
  }

  const renderKeys = showMore ? changes : changes.slice(0, MIN_ITEMS);

  var cell: JSX.Element[] = renderKeys.map((item: any, index: number) => {
    return (
      <div className="flex flex-row max-w-full" key={index}>
        <div className="flex max-w-full items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
          {item.change_type === "diff" ? (
            item.total
          ) : (
            <div
              data-tip={`${item.change_type}: ${item.total}`}
              className="flex flex-row max-w-full space-x-1 "
            >
              <div className="text-ellipsis overflow-hidden">
                {item.change_type}:
              </div>
              <div className=""> {item.total}</div>
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
      <div className="flex flex-col flex-1 max-w-[24rem]">{cell}</div>
    </div>
  );
}

function TypeCell({ row, column }: CellProp): JSX.Element {
  const name = row.isGrouped
    ? row.subRows[0]?.original.external_type
    : row.original.external_type;
  const secondary = row.isGrouped
    ? row.subRows[0]?.original.config_type
    : row.original.config_type;

  return (
    <span className="flex flex-nowrap">
      <Icon name={name} secondary={secondary} />
      <span className="pl-1"> {row.values[column.id]}</span>
    </span>
  );
}

function analysisIcon(analysis: Analysis) {
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

function AnalysisCell({ row, column }: CellProp): JSX.Element {
  const analysis = row?.values[column.id] || [];
  if (analysis.length === 0) {
    return <span></span>;
  }

  var cell: JSX.Element[] = [];
  analysis.forEach((item: Analysis, index: number) => {
    cell.push(
      <span className="flex flex-nowrap pb-0.5 " key={index}>
        {analysisIcon(item)} <span className="pl-1">{item.analyzer}</span>
      </span>
    );
  });
  return <span>{cell}</span>;
}

function CostCell({ row, column }: CellProp): JSX.Element {
  const cost = row?.values[column.id];
  if (!cost || parseFloat(cost.toFixed(2)) === 0) {
    return <span></span>;
  }
  return <FormatCurrency value={cost} />;
}

function DateCell({ row, column }: CellProp): JSX.Element {
  const dateString = row?.values[column.id];
  if (dateString === "0001-01-01T00:00:00") {
    return <span></span>;
  }
  return (
    <div className="text-xs">
      {dateString ? timeago.format(dateString) : ""}
    </div>
  );
}

function ChangeAggregate(leafValues: any[]) {
  let sum = 0;
  leafValues.forEach((leafVal) => {
    if (leafVal) {
      leafVal.forEach((item: any) => {
        sum += item.total;
      });
    }
  });
  return sum;
}

function CostAggregate({ value }: { value: number }) {
  return !value || parseFloat(value.toFixed(2)) === 0 ? (
    ""
  ) : (
    <FormatCurrency value={value} />
  );
}

function ChangedAccessor(row: any) {
  return getTimeBucket(row.updated_at);
}

function ChangedSorted(rowA: any, rowB: any, columnId: string) {
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

interface CellData {
  config_type: string;
  analysis: Analysis[];
  changes: object[];
  type: string;
  external_type: string;
  name: string;
  tags?: { Key: string; Value: string }[] | { [index: string]: any };
  created_at: string;
  updated_at: string;
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
}

export interface Props {
  data: ConfigItem[];
  handleRowClick: (row?: any) => void;
  isLoading: boolean;
}

function ConfigList({ data, handleRowClick, isLoading }: Props) {
  const [queryParams] = useSearchParams({
    sortBy: "",
    sortOrder: "",
    groupBy: "config_type"
  });

  const groupByField = queryParams.get("groupBy");

  const setHiddenColumns = () => {
    if (groupByField !== "changed" && groupByField !== "tags") {
      return ["changed", "allTags"];
    } else if (groupByField === "tags") {
      return ["changed"];
    }
    return [];
  };

  return (
    <DataTable
      stickyHead
      columns={columns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      groupBy={
        !groupByField || groupByField === "no_grouping" ? null : [groupByField]
      }
      hiddenColumns={setHiddenColumns()}
      usageSection="config-list"
    />
  );
}

export default ConfigList;
