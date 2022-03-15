import dayjs from "dayjs";

export function TagsCell({ row, column }) {
  const tags = row?.values[column.id];
  return (
    <div className="flex">
      {tags?.length > 0 ? (
        tags.map((tag) => (
          <div className="border rounded-md" key={tag}>
            {tag}
          </div>
        ))
      ) : (
        <span>no tags</span>
      )}
    </div>
  );
}

export function DateCell({ row, column }) {
  const dateString = row?.values[column.id];
  return (
    <div className="">
      {dateString ? dayjs(dateString).format("MMM DD HH:mm") : "None"}
    </div>
  );
}
