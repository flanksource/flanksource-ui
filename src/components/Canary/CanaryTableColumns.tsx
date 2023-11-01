import { CellContext, ColumnDef } from "@tanstack/react-table";
import { HealthCheck } from "../../api/types/health";
import { IoChevronForwardOutline } from "react-icons/io5";
import {
  LastTransistionCell,
  LatencyCell,
  TitleCell,
  UptimeCell
} from "./Columns";
import { Status } from "../Status";
import { dateDiff } from "../../utils/date";

function ExpandArrow({ row }: CellContext<HealthCheck, any>) {
  return row.getCanExpand() ? (
    <div className="ml-6 flex">
      <div
        className={`transform duration-200 ${
          row.getIsExpanded() ? "rotate-90" : ""
        }`}
      >
        <IoChevronForwardOutline />
      </div>
    </div>
  ) : null;
}

type TableColumnsProps = {
  showNamespaceTags: boolean;
  hideNamespacePrefix: boolean;
};

export function getCanaryTableColumns({
  showNamespaceTags,
  hideNamespacePrefix
}: TableColumnsProps): ColumnDef<HealthCheck>[] {
  return [
    {
      id: "expander",
      cell: ExpandArrow,
      enableSorting: false,
      meta: { cellClassName: "py-2" }
    },
    {
      header: "Checks",
      accessorKey: "name",
      id: "name",
      meta: {
        cellClassName: "py-2 px-2 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: true,
      cell: ({ ...props }: CellContext<HealthCheck, any>) => (
        <TitleCell
          {...props}
          showNamespaceTags={showNamespaceTags}
          hideNamespacePrefix={hideNamespacePrefix}
        />
      )
    },
    {
      header: "Health",
      accessorKey: "status",
      meta: {
        cellClassName: "w-36 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: true,
      cell: ({ getValue, row }: CellContext<HealthCheck, any>) => {
        const value = getValue();
        if (!value) {
          return null;
        }
        if (typeof value === "object") {
          return <Status good={value.good} mixed={value.mixed} />;
        }
        const date = new Date().toISOString().split(".")[0];
        const lastRutime = row.original.lastRuntime;
        const showTime = dateDiff(date, lastRutime, "minute") > 15;
        return (
          <div className="items-center flex space-x-1">
            <Status good={value === "healthy"} />
            {showTime && (
              <LastTransistionCell value={row.original.lastRuntime} />
            )}
          </div>
        );
      }
    },
    {
      header: "Last Transition",
      accessorKey: "last_transition_time",
      meta: {
        cellClassName: "w-36 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: false,
      cell: ({ getValue, row }: CellContext<HealthCheck, any>) => {
        const value = getValue();
        if (!value) {
          return null;
        }
        return <LastTransistionCell value={value} />;
      }
    },
    {
      header: "Uptime",
      accessorKey: "uptime",
      meta: {
        cellClassName: "w-28 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: true,
      cell: ({ getValue }: CellContext<HealthCheck, any>) => {
        const value = getValue();
        if (!value) {
          return null;
        }
        const newValue = value?.uptime ?? value;
        return <UptimeCell value={newValue} />;
      }
    },
    {
      header: "Latency",
      accessorKey: "latency",
      meta: {
        cellClassName: "w-28 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: true,
      cell: ({ getValue }: CellContext<HealthCheck, any>) => {
        const value = getValue();
        if (!value) {
          return null;
        }
        return <LatencyCell value={value} />;
      }
    }
  ];
}
