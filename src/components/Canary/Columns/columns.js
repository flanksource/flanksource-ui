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
    cellClass: `py-2 px-2 overflow-hidden overflow-ellipsis relative`
  }
};

export const columnObject = {
  ...firstColumns,
  health: {
    Header: "Health",
    accessor: "status",
    cellClass:
      "w-16 xl:w-20 2xl:w-36 overflow-hidden overflow-ellipsis relative"
  },
  last_transition_time: {
    Header: "Last Transition",
    accessor: "last_transition_time",
    cellClass:
      "w-20 xl:w-24 2xl:w-36 overflow-hidden overflow-ellipsis relative"
  },
  uptime: {
    Header: "Uptime",
    accessor: "uptime",
    cellClass: "w-16 2xl:w-36 overflow-hidden overflow-ellipsis relative"
  },
  latency: {
    Header: "Latency",
    accessor: "latency",
    cellClass: "w-16 2xl:w-36 overflow-hidden overflow-ellipsis relative"
  }
};
