import { getColumns } from "../../../components/Canary/Columns/index";

describe("getColumns", () => {
  it("getColumns({ standardColumnsObject }) => output", () => {
    const columnObject = {
      expander: {
        id: "expander",
        cellClass: ""
      },
      health: {
        Header: "Health",
        accessor: "checkStatuses"
      },
      uptime: {
        Header: "Uptime",
        accessor: "uptime"
      }
    };

    const expectedOutput = [
      {
        id: "expander",
        Header: expect.any(Function),
        Cell: expect.any(Function),
        sortType: "alphanumeric",
        cellClass: ""
      },
      {
        Header: "Health",
        accessor: "checkStatuses",
        Cell: expect.any(Function),
        sortType: expect.any(Function),
        cellClass: "py-2"
      },
      {
        Header: "Uptime",
        accessor: "uptime",
        Cell: expect.any(Function),
        sortType: expect.any(Function),
        cellClass: "py-2"
      }
    ];
    expect(getColumns({ columnObject })).toStrictEqual(expectedOutput);
  });

  it("getColumns({ columnsObjectWithOverridesAndMissingValues }) => output", () => {
    const columnObject = {
      health: {
        Cell: "foo",
        sortType: "foo",
        cellClass: "px-5"
      },
      uptime: {
        Header: "Uptime",
        accessor: "uptime"
      }
    };

    const expectedOutput = [
      {
        Header: expect.any(Function),
        Cell: "foo",
        sortType: "alphanumeric",
        cellClass: "px-5"
      },
      {
        Header: "Uptime",
        accessor: "uptime",
        Cell: expect.any(Function),
        sortType: expect.any(Function),
        cellClass: "py-2"
      }
    ];
    expect(getColumns({ columnObject })).toStrictEqual(expectedOutput);
  });
});
