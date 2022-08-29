import { useState } from "react";
import * as timeago from "timeago.js";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

import { DataTable, Icon } from "../";
import _ from "lodash";

interface TableCols {
  Header: string;
  accessor: string;
  cellClass?: string;
  Cell?: React.ComponentType<CellProp>;
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
    Cell: ChangeCell
  },
  {
    Header: "Analysis",
    accessor: "analysis",
    Cell: AnalysisCell
  },

  {
    Header: "Tags",
    accessor: "tags",
    Cell: TagsCell,
    cellClass: "overflow-auto"
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
  row: { values: { [index: string]: any } };
  column: { id: string };
}

const MIN_ITEMS = 2;

function TagsCell({ row, column }: CellProp) {
  const [showMore, setShowMore] = useState(false);

  const tagMap = row?.values[column.id] || {};
  const tagKeys = Object.keys(tagMap).sort();

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

      <div className="font-mono flex flex-wrap w-96 pl-1 space-y-1">
        {renderKeys.map((key) => (
          <div
            className="bg-gray-200 border border-gray-300 px-1 py-0.75 mr-1 rounded-md text-gray-600 font-semibold text-xs"
            key={key}
          >
            {key}: <span className="font-light">{tagMap[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangeCell({ row, column }: CellProp) {
  const changes = row?.values[column.id];
  if (changes == null) {
    return "";
  }
  var cell = [];
  changes.map((item) => {
    _.forEach(item, (v, k) => {
      if (k == "diff") {
        cell.push(
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            {v}
          </span>
        );
      } else {
        cell.push(
          <>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
              {k} (v)
            </span>
            <br />
          </>
        );
      }
    });
  });
  return cell;
}

function TypeCell({ row, column }: CellProp) {
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

function AnalysisCell({ row, column }: CellProp) {
  const analysis = row?.values[column.id] || [];
  if (analysis.length === 0) {
    return "";
  }

  var cell = [];
  analysis.map((item) => {
    cell.push(
      <>
        {item}
        <br />
      </>
    );
  });
  return cell;
}

function DateCell({ row, column }: CellProp) {
  const dateString = row?.values[column.id];
  if (dateString === "0001-01-01T00:00:00") {
    return "";
  }
  return (
    <div className="text-xs">
      {dateString ? timeago.format(dateString) : "None"}
    </div>
  );
}

interface CellData {
  config_type: string;
  analysis: string[];
  changes: object[];
  type: string;
  external_type: string;
  name: string;
  tags?: { Key: string; Value: string }[] | { [index: string]: any };
  created_at: string;
  updated_at: string;
}

export interface Props {
  data: CellData[];
  handleRowClick: () => {};
  isLoading: boolean;
}

function ConfigList({ data, handleRowClick, isLoading }: Props) {
  return (
    <DataTable
      stickyHead
      columns={columns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
    />
  );
}

export default ConfigList;
