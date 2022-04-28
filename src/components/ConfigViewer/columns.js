import React, { useMemo } from "react";
import dayjs from "dayjs";

export const TagsCell = React.memo(({ row, column }) => {
  const tagElements = useMemo(() => {
    const tags = row?.values[column.id] || [];
    return tags.map((tag) => (
      <div
        className="bg-gray-200 px-1 py-0.5 mr-1 rounded-md text-gray-600 font-semibold text-xs"
        key={tag}
      >
        {tag}
      </div>
    ));
  }, [row, column]);
  return (
    <div className="flex">
      {tagElements?.length > 0 ? (
        tagElements
      ) : (
        <span className="text-gray-400">none</span>
      )}
    </div>
  );
});

TagsCell.displayName = "TagsCell";

export const DateCell = React.memo(({ row, column }) => {
  const dateString = row?.values[column.id];
  return (
    <div className="text-xs">
      {dateString ? dayjs(dateString).format("YYYY-DD-MM h:mm A") : "None"}
    </div>
  );
});

DateCell.displayName = "DateCell";

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
