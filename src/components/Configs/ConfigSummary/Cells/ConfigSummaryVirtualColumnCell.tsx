import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { CellContext } from "@tanstack/react-table";
import { BiLabel } from "react-icons/bi";

export function ConfigSummaryVirtualColumnCell({
  getValue,
  row,
  groupByTags,
  columnId
}: CellContext<ConfigSummary, any> & {
  groupByTags: string[];
  columnId: string;
}) {
  const isTag = groupByTags.includes(columnId);
  const value = getValue();

  return (
    <div
      className="flex flex-1 flex-row items-center gap-1"
      style={{
        marginLeft: row.depth * 20
      }}
    >
      {isTag && <BiLabel />}
      {value ? (
        <span>{value}</span>
      ) : (
        <span className="text-gray-400">(None)</span>
      )}
      <Badge text={row.original.count} />
    </div>
  );
}
