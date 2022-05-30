import { useMemo } from "react";
import * as timeago from "timeago.js";

export const defaultTableColumns = [
  {
    Header: "Type",
    accessor: "config_type",
    cellClass: `px-5 py-2`
  },
  {
    Header: "Name",
    accessor: "name",
    cellClass: `px-5 py-2`
  },
  {
    Header: "Tags",
    accessor: "tags",
    Cell: TagsCell,
    cellClass: `px-5 py-2`
  },
  {
    Header: "Created",
    accessor: "created_at",
    Cell: DateCell,
    cellClass: `px-5 py-2`
  },
  {
    Header: "Last Updated",
    accessor: "updated_at",
    Cell: DateCell,
    cellClass: `px-5 py-2`
  }
];

export function TagsCell({ row, column }) {
  const tags = row?.values[column.id];
  const tagElements = useMemo(
    () =>
      tags?.map((tag) => (
        <div
          className="bg-gray-200 px-1 py-0.5 mr-1 rounded-md text-gray-600 font-semibold text-xs"
          key={tag}
        >
          {tag}
        </div>
      )),
    [tags]
  );
  return (
    <div className="flex">
      {tagElements?.length > 0 ? (
        tagElements
      ) : (
        <span className="text-gray-400">none</span>
      )}
    </div>
  );
}

export function DateCell({ row, column }) {
  const dateString = row?.values[column.id];
  return (
    <div className="text-xs">
      {dateString ? timeago.format(dateString) : "None"}
    </div>
  );
}
