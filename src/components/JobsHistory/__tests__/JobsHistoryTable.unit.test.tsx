import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
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
      name: "JobName1",
      status: "SUCCESS",
      duration_millis: 123456,
      created_at: "2022-01-01T00:00:00Z",
      success_count: 250,
      error_count: 0,
      hostname: "localhost",
      resource_id: "resource_id",
      resource_type: "topology",
      time_start: "2022-01-01T00:00:00Z",
      time_end: "2022-01-01T00:02:03Z",
      resource_name: "resource_name_1"
    },
    {
      id: "2",
      name: "JobName2",
      status: "FAILED",
      duration_millis: 654321,
      created_at: "2022-01-02T00:00:00Z",
      success_count: 300,
      error_count: 0,
      hostname: "localhost",
      resource_id: "resource_id_2",
      resource_type: "canary",
      time_start: "2022-01-01T00:00:00Z",
      time_end: "2022-01-01T00:02:03Z",
      resource_name: "resource_name_2"
    }
  ];

  it("renders the table with the correct column headers", () => {
    render(
      <MemoryRouter>
        <JobsHistoryTable jobs={data} pageCount={1} />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("columnheader", { name: "Resource" })
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
      <MemoryRouter>
        <JobsHistoryTable jobs={data} pageCount={1} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("cell", {
        name: /Job Name 1/i
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "2m3s" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /resource_name_1/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("cell", { name: /Job Name 2/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "10m54s" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /resource_name_2/i })
    ).toBeInTheDocument();
  });
});
