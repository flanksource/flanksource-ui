import { IoChevronForwardOutline } from "react-icons/io5";

function ExpandArrow({ row }) {
  return row.canExpand ? (
    <div className="ml-6 flex">
      <div
        className={`transform duration-200 ${
          row.isExpanded ? "rotate-90" : ""
        }`}
      >
        <IoChevronForwardOutline />
      </div>
    </div>
  ) : null;
}

export const firstColumns = {
  expander: {
    id: "expander",
    Cell: ExpandArrow,
    cellClass: ""
  },
  name: {
    Header: "Checks",
    accessor: "name",
    cellClass: `px-5 py-2 w-full max-w-0 overflow-hidden overflow-ellipsis relative`
  }
};

export const columnObject = {
  ...firstColumns,
  health: {
    Header: "Health",
    accessor: "status"
  },
  last_transition_time: {
    Header: "Last Transistion Time",
    accessor: "last_transition_time"
  },
  uptime: {
    Header: "Uptime",
    accessor: "uptime"
  },
  latency: {
    Header: "Latency",
    accessor: "latency"
  }
};
