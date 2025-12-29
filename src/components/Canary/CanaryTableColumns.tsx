import { CellContext, ColumnDef } from "@tanstack/react-table";
import { IoChevronForwardOutline } from "react-icons/io5";
import { HealthCheck } from "../../api/types/health";
import { Status } from "../Status";
import {
  LastTransitionCell,
  LatencyCell,
  TitleCell,
  UptimeCell
} from "./Columns";

function ExpandArrow({ row }: CellContext<HealthCheck, any>) {
  return row.getCanExpand() ? (
    <div className="ml-2 flex">
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
      meta: { cellClassName: "py-2 w-8" }
    },
    {
      header: "Checks",
      accessorKey: "name",
      id: "name",
      meta: {
        cellClassName: "py-2 overflow-hidden overflow-ellipsis relative"
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
        cellClassName: "w-28 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: true,
      cell: ({ getValue, row }: CellContext<HealthCheck, any>) => {
        let value = getValue();
        if (!value) {
          return null;
        }
        let good,
          mixed = false;
        if (typeof value === "object") {
          good = value.good;
          mixed = value.mixed;
        } else {
          good = value === "healthy";
        }
        return (
          <div className="flex items-center space-x-1">
            <Status good={good} mixed={mixed} variant="dot" />
            <LastTransitionCell
              value={row.original.last_runtime}
              min={1000 * 60 * 60 + 1}
            />
          </div>
        );
      }
    },

    {
      header: "Uptime",
      accessorKey: "uptime",
      meta: {
        cellClassName: "w-28 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: true,
      cell: ({ getValue, row }: CellContext<HealthCheck, any>) => {
        if (row.getCanExpand()) {
          const subRows = row.subRows;
          // we want to take those with only uptime passed, and leave out those
          // with uptime failed
          const passed = subRows.filter((subRow) => {
            const value = subRow.original.uptime;
            if (!value) {
              return false;
            }
            const uptime = value.passed / (value.passed + value.failed);
            if (uptime === 1) {
              return true;
            }
            return false;
          }).length;

          return (
            <>
              {passed}/{subRows.length}
            </>
          );
        }

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
    },
    {
      header: "Transition",
      accessorKey: "last_transition_time",
      meta: {
        cellClassName: "w-28 overflow-hidden overflow-ellipsis relative"
      },
      enableSorting: false,
      cell: ({ getValue, row }: CellContext<HealthCheck, any>) => {
        const value = getValue();
        if (!value) {
          return null;
        }
        return <LastTransitionCell value={value} />;
      }
    }
  ];
}
