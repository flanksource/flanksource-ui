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

interface TableCols {
  Header: string;
  accessor: string;
  cellClass?: string;
  Cell?: React.ComponentType<CellProp>;
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
    Cell: TypeCell
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Changes",
    accessor: "changes",
    Cell: React.memo(ChangeCell)
  },
  {
    Header: "Analysis",
    accessor: "analysis",
    Cell: AnalysisCell
  },
  {
    Header: "Cost (per min)",
    accessor: "cost_per_minute",
    Cell: CostCell
  },
  {
    Header: "Cost (24hr)",
    accessor: "cost_total_1d",
    Cell: CostCell
  },
  {
    Header: "Cost (7d)",
    accessor: "cost_total_7d",
    Cell: CostCell
  },
  {
    Header: "Cost (30d)",
    accessor: "cost_total_30d",
    Cell: CostCell
  },
  {
    Header: "Tags",
    accessor: "tags",
    Cell: React.memo(TagsCell)
  },
  {
    Header: "Created",
    accessor: "created_at",
    Cell: DateCell
  },
  {
    Header: "Last Updated",
    accessor: "updated_at",
    Cell: DateCell
  }
];

interface CellProp {
  row: { values: { [index: string]: any }; original: { [index: string]: any } };
  column: { id: string };
}

const MIN_ITEMS = 2;

function TagsCell({ row, column }: CellProp): JSX.Element {
  const [showMore, setShowMore] = useState(false);

  const tagMap = row?.values[column.id] || {};
  const tagKeys = Object.keys(tagMap).sort();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (tagKeys.length === 0) {
    return <div className="flex"></div>;
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

  var cell: JSX.Element[] = renderKeys.map((item: any) => {
    return (
      <div className="flex flex-row max-w-full">
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
  return (
    <span className="flex flex-nowrap">
      <Icon
        name={row.original.external_type}
        secondary={row.original.config_type}
        size="lg"
      />{" "}
      <span className="pl-1"> {row.values[column.id]} </span>{" "}
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
  analysis.forEach((item: Analysis) => {
    cell.push(
      <span className="flex flex-nowrap pb-0.5 ">
        {analysisIcon(item)} <span className="pl-1">{item.analyzer}</span>
      </span>
    );
  });
  return <span>{cell}</span>;
}

function CostCell({ row, column }: CellProp): JSX.Element {
  const cost = row?.values[column.id];
  if (!cost) {
    return <span></span>;
  }
  return (
    <span>
      <FormatCurrency value={cost} />
    </span>
  );
}

function DateCell({ row, column }: CellProp): JSX.Element {
  const dateString = row?.values[column.id];
  if (dateString === "0001-01-01T00:00:00") {
    return <span></span>;
  }
  return (
    <div className="text-xs">
      {dateString ? timeago.format(dateString) : "None"}
    </div>
  );
}

export interface Props {
  data: ConfigItem[];
  handleRowClick: (row?: any) => void;
  isLoading: boolean;
}

function ConfigList({ data, handleRowClick, isLoading }: Props) {
  const [queryParams, setQueryParams] = useSearchParams({
    sortBy: "config_type",
    sortOrder: "asc"
  });

  const sortField = queryParams.get("sortBy");
  const isSortOrderDesc = queryParams.get("sortOrder") === "asc" ? false : true;

  const setSortBy = (field: string, order: "asc" | "desc") => {
    setQueryParams({
      sortBy: field,
      sortOrder: order
    });
  };

  return (
    <DataTable
      stickyHead
      columns={columns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
      sortBy={[
        {
          id: sortField,
          desc: isSortOrderDesc
        }
      ]}
      setSortBy={setSortBy}
    />
  );
}

export default ConfigList;
