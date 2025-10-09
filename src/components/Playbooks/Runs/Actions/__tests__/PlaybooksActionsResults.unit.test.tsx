import { render, screen } from "@testing-library/react";
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
});
