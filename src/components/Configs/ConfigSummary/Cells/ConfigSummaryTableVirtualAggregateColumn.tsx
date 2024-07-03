import { ConfigSummary } from "@flanksource-ui/api/types/configs";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { CellContext } from "@tanstack/react-table";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";

export function ConfigSummaryTableVirtualAggregateColumn({
  row
}: CellContext<ConfigSummary, any>) {
  if (row.getCanExpand()) {
    const groupingValue = row.getGroupingValue(row.groupingColumnId!) as string;
    const count = row.subRows.reduce((acc, row) => acc + row.original.count, 0);
    return (
      <div
        className="flex flex-row items-center gap-1"
        style={{
          marginLeft: row.depth * 20
        }}
      >
        {row.getIsExpanded() ? <IoChevronDown /> : <IoChevronForward />}
        {row.groupingColumnId === "type" ||
        row.groupingColumnId === "config_class" ? (
          <ConfigsTypeIcon
            config={row.original}
            showLabel={row.groupingColumnId === "type"}
            showSecondaryIcon={row.groupingColumnId === "type"}
          >
            <div className="flex flex-row items-center gap-1">
              {row.groupingColumnId === "config_class" && (
                <span>{groupingValue}</span>
              )}
              <Badge text={count} />
            </div>
          </ConfigsTypeIcon>
        ) : (
          <div className="flex flex-row gap-1 items-center">
            {groupingValue ? (
              <span>{groupingValue}</span>
            ) : (
              <span className="text-gray-400">(None)</span>
            )}
            <Badge text={count} />
          </div>
        )}
      </div>
    );
  }
}
