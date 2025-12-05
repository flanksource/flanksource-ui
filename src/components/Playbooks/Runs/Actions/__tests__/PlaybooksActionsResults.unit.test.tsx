import { fireEvent, render, screen, within } from "@testing-library/react";
import PlaybooksRunActionsResults from "../PlaybooksActionsResults";

describe("PlaybooksRunActionsResults", () => {
  it("renders 'No result' when result is falsy", () => {
    render(
      <PlaybooksRunActionsResults
        action={{
          id: "1",
          name: "test",
          status: "completed",
          playbook_run_id: "1",
          start_time: "2024-01-01"
        }}
      />
    );
    expect(screen.getByText("No result")).toBeInTheDocument();
  });

  it("renders stdout when result has stdout", () => {
    const action = {
      id: "1",
      name: "test",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      result: { stdout: "Hello, world!" }
    };
    render(<PlaybooksRunActionsResults action={action} />);
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders logs when result has logs", () => {
    const action = {
      id: "1",
      name: "test",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      result: { logs: "Hello, world!" }
    };
    render(<PlaybooksRunActionsResults action={action} />);
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders JSON when result has neither stdout nor logs", () => {
    const action = {
      id: "1",
      name: "test",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      result: { foo: "bar" }
    };
    render(<PlaybooksRunActionsResults action={action} />);
    expect(
      screen.getByText("foo", {
        exact: false
      })
    ).toBeInTheDocument();
  });

  it("shows stdout as the first tab", () => {
    const action = {
      id: "1",
      name: "test",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      result: { stdout: "Hello, world!", stderr: "Goodbye, world!" }
    };
    render(<PlaybooksRunActionsResults action={action} />);
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders error when action has error", () => {
    const action = {
      id: "1",
      name: "test",
      status: "failed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      error: "Something went wrong"
    };
    render(<PlaybooksRunActionsResults action={action} />);
    expect(
      screen.getByText("Something went wrong", {
        exact: false
      })
    ).toBeInTheDocument();
  });

  it("renders sql rows as a markdown table", () => {
    const action = {
      id: "1",
      name: "sql action",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "sql" as const,
      result: {
        query: "select * from tests",
        rows: [
          { id: "123", name: "alpha" },
          { id: "456", name: "beta" }
        ],
        count: 2
      }
    };

    render(<PlaybooksRunActionsResults action={action} />);

    fireEvent.click(screen.getByText("Rows"));

    const table = screen.getByRole("table");
    expect(within(table).getByText("id")).toBeInTheDocument();
    expect(within(table).getByText("alpha")).toBeInTheDocument();
    expect(within(table).getByText("beta")).toBeInTheDocument();
  });

  it("escapes pipes and newlines in sql rows", () => {
    const action = {
      id: "1",
      name: "sql action",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "sql" as const,
      result: {
        rows: [
          {
            description: "foo|bar\nbaz"
          }
        ]
      }
    };

    render(<PlaybooksRunActionsResults action={action} />);

    fireEvent.click(screen.getByText("Rows"));

    const table = screen.getByRole("table");
    const firstCell = within(table).getAllByRole("cell")[0];
    expect(firstCell.innerHTML).toContain("foo|bar<br>baz");
  });

  it("renders sql query as preformatted text", () => {
    const query = "SELECT *\nFROM tests\nWHERE id = 1";
    const action = {
      id: "1",
      name: "sql action",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "sql" as const,
      result: {
        query,
        rows: [],
        count: 0
      }
    };

    render(<PlaybooksRunActionsResults action={action} />);

    fireEvent.click(screen.getByText("Query"));

    expect(screen.getByText(/SELECT/i)).toBeInTheDocument();
    expect(screen.getByText(/FROM/i)).toBeInTheDocument();
    expect(screen.getByText(/tests/i)).toBeInTheDocument();
  });
});
