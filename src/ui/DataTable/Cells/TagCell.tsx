import { CellContext } from "@tanstack/react-table";

export function TagsCell({ row, column }: CellContext<any, any>): JSX.Element {
  const tags = row?.getValue<any[]>(column.id);

  return (
    <div className="flex">
      {tags?.length > 0 ? (
        tags?.map((tag) => (
          <div
            className="mr-1 rounded-md bg-gray-200 px-1 py-0.5 text-xs font-semibold text-gray-600"
            key={tag}
          >
            {tag}
          </div>
        ))
      ) : (
        <span className="text-gray-400"></span>
      )}
    </div>
  );
}
