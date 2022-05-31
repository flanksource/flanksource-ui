import * as timeago from "timeago.js";

import { DataTable } from "../";

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
    cellClass: "px-5 py-2"
  },
  {
    Header: "Name",
    accessor: "name",
    cellClass: "px-5 py-2"
  },
  {
    Header: "Tags",
    accessor: "tags",
    Cell: TagsCell,
    cellClass: "px-5 py-2 overflow-auto"
  },
  {
    Header: "Created",
    accessor: "created_at",
    Cell: DateCell,
    cellClass: "px-5 py-2"
  },
  {
    Header: "Last Updated",
    accessor: "updated_at",
    Cell: DateCell,
    cellClass: "px-5 py-2"
  }
];

interface CellProp {
  row: { values: { [index: string]: any } };
  column: { id: string };
}

function TagsCell({ row, column }: CellProp) {
  const tags = row?.values[column.id];
  if (!tags || Object.keys(tags).length === 0) {
    return (
      <div className="flex">
        <span className="text-gray-400">none</span>
      </div>
    );
  }

  return (
    <div className="font-mono flex flex-wrap w-96 space-y-1.5">
      {Object.keys(tags).map((key) => (
        <div
          className="bg-gray-200 border border-gray-300 px-1 py-0.75 mr-1 rounded-md text-gray-600 font-semibold text-xs"
          key={key}
        >
          {key}: <span className="font-light">{tags[key]}</span>
        </div>
      ))}
    </div>
  );
}

function DateCell({ row, column }: CellProp) {
  const dateString = row?.values[column.id];
  return (
    <div className="text-xs">
      {dateString ? timeago.format(dateString) : "None"}
    </div>
  );
}

interface CellData {
  config_type: string;
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
      columns={columns}
      data={data}
      handleRowClick={handleRowClick}
      tableStyle={{ borderSpacing: "0" }}
      isLoading={isLoading}
    />
  );
}

export default ConfigList;
