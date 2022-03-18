import dayjs from "dayjs";

export function TagsCell({ row, column }) {
  const tags = row?.values[column.id];
  return (
    <div className="flex">
      {tags?.length > 0 ? (
        tags.map((tag) => (
          <div
            className="bg-gray-200 px-1 py-0.5 mr-1 rounded-md text-gray-600 font-semibold text-xs"
            key={tag}
          >
            {tag}
          </div>
        ))
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
      {dateString ? dayjs(dateString).format("h:mm A, DD-MM-YYYY") : "None"}
    </div>
  );
}
