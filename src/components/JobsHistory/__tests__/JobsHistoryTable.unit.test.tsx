import { render, screen } from "@testing-library/react";
import JobsHistoryTable, { JobHistory } from "./../JobsHistoryTable";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe("JobsHistoryTable", () => {
  const data: JobHistory[] = [
    {
      id: "1",
      name: "Job 1",
      status: "SUCCESS",
      duration_millis: 123456,
      created_at: "2022-01-01T00:00:00Z",
      success_count: 250,
      error_count: 0,
      hostname: "localhost",
      resource_id: "resource_id",
      resource_type: "topology",
      time_start: "2022-01-01T00:00:00Z",
      time_end: "2022-01-01T00:02:03Z"
    },
    {
      id: "2",
      name: "Job 2",
      status: "FAILED",
      duration_millis: 654321,
      created_at: "2022-01-02T00:00:00Z",
      success_count: 300,
      error_count: 0,
      hostname: "localhost",
      resource_id: "resource_id_2",
      resource_type: "canary",
      time_start: "2022-01-01T00:00:00Z",
      time_end: "2022-01-01T00:02:03Z"
    }
  ];

  it("renders the table with the correct column headers", () => {
    render(
      <JobsHistoryTable
        jobs={data}
        pageCount={1}
        pageIndex={1}
        pageSize={1}
        sortBy={""}
        sortOrder={""}
      />
    );
    expect(
      screen.getByRole("columnheader", { name: "Resource Type" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Resource ID" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Timestamp" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Job Name" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Status" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Duration" })
    ).toBeInTheDocument();
  });

  it("renders the table with the correct data cells", () => {
    render(
      <JobsHistoryTable
        jobs={data}
        pageCount={1}
        pageIndex={1}
        pageSize={1}
        sortBy={""}
        sortOrder={""}
      />
    );

    expect(
      screen.getByRole("cell", {
        name: /Job 1/i
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "2m3s" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "resource_id" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "topology" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Job 2" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "10m54s" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "resource_id_2" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "canary" })).toBeInTheDocument();
  });
});
