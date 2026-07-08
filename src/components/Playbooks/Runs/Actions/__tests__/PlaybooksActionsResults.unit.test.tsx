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

  it("uses columns array to maintain column order in sql results", () => {
    const action = {
      id: "1",
      name: "sql action",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "sql" as const,
      result: {
        query: "select name, id from tests",
        columns: ["name", "id"],
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
    const headerCells = within(table).getAllByRole("columnheader");

    // Columns should be in the order specified by columns array: name, id
    expect(headerCells[0]).toHaveTextContent("name");
    expect(headerCells[1]).toHaveTextContent("id");
  });

  it("renders stdout as markdown when contentType is text/markdown", () => {
    const action = {
      id: "1",
      name: "exec with markdown",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "exec" as const,
      result: {
        stdout: "# My Report",
        exitCode: 0,
        contentType: "text/markdown"
      }
    };
    render(<PlaybooksRunActionsResults action={action} />);
    // Markdown should be rendered as HTML heading
    expect(screen.getByText("My Report")).toBeInTheDocument();
    expect(screen.getByText("My Report").tagName).toBe("H1");
  });

  it("renders stdout as plain text when no contentType is specified", () => {
    const action = {
      id: "1",
      name: "exec plain",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "exec" as const,
      result: {
        stdout: "hello world",
        exitCode: 0
      }
    };
    render(<PlaybooksRunActionsResults action={action} />);
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("renders html content types with charset in an iframe", () => {
    const html = "<html><body><h1>HTML Report</h1></body></html>";
    const action = {
      id: "1",
      name: "exec html",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "exec" as const,
      result: {
        stdout: html,
        contentType: "text/html; charset=UTF-8"
      }
    };

    render(<PlaybooksRunActionsResults action={action} />);

    const iframe = screen.getByTitle("Stdout");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "srcdoc",
      expect.stringContaining("<h1>HTML Report</h1>")
    );
  });

  it("blocks javascript by withholding allow-scripts from the iframe sandbox", () => {
    const html =
      '<h1 onclick="alert(1)">Report</h1><script>alert("xss")</script>';
    const action = {
      id: "1",
      name: "exec html",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "exec" as const,
      result: {
        stdout: html,
        contentType: "text/html"
      }
    };

    render(<PlaybooksRunActionsResults action={action} />);

    const iframe = screen.getByTitle("Stdout");
    // The sandbox must never grant allow-scripts; the browser then refuses to
    // execute any script, inline handler or javascript: URL in the content.
    expect(iframe.getAttribute("sandbox")).not.toContain("allow-scripts");
  });

  it("preserves css verbatim when rendering html", () => {
    // Tailwind-style resets with empty custom properties and pseudo-element
    // selectors must survive untouched.
    const css =
      "*, ::before, ::after { --tw-ring-color: rgb(59 130 246 / 0.5); --tw-pan-x:  ; }" +
      "::backdrop { --tw-translate-x: 0; }" +
      "@media (max-width: 600px) { .box { color: blue; } }";
    const html =
      "<html><head>" +
      '<link rel="stylesheet" href="https://cdn.example.com/report.css">' +
      `<style>${css}</style>` +
      '</head><body><div class="box" style="font-weight:bold;">Styled</div></body></html>';
    const action = {
      id: "1",
      name: "exec html",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "exec" as const,
      result: {
        stdout: html,
        contentType: "text/html"
      }
    };

    render(<PlaybooksRunActionsResults action={action} />);

    const srcDoc = screen.getByTitle("Stdout").getAttribute("srcdoc");
    expect(srcDoc).toContain(`<style>${css}</style>`);
    expect(srcDoc).toContain('style="font-weight:bold;"');
    expect(srcDoc).toContain('class="box"');
    expect(srcDoc).toContain(
      '<link rel="stylesheet" href="https://cdn.example.com/report.css">'
    );
  });

  it("does not show contentType as its own tab", () => {
    const action = {
      id: "1",
      name: "exec with content type",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "exec" as const,
      result: {
        stdout: "# My Report",
        exitCode: 0,
        contentType: "text/markdown"
      }
    };
    render(<PlaybooksRunActionsResults action={action} />);
    // contentType should not appear as a tab label
    expect(screen.queryByText("ContentType")).not.toBeInTheDocument();
    expect(screen.queryByText("text/markdown")).not.toBeInTheDocument();
  });

  it("shows small AI action costs and exact cost on hover", async () => {
    const action = {
      id: "1",
      name: "ai action",
      status: "completed" as const,
      playbook_run_id: "1",
      start_time: "2024-01-01",
      type: "ai" as const,
      result: {
        json: '{ "answer": "ok" }',
        generationInfo: [
          {
            cost: 0.0018809
          },
          {
            cost: 0.0017708999999999997
          }
        ]
      }
    };

    render(<PlaybooksRunActionsResults action={action} />);

    fireEvent.pointerMove(screen.getByText("AI ($0.0037)"), {
      pointerType: "mouse"
    });

    expect(screen.getByText("AI ($0.0037)")).toBeInTheDocument();
    expect(await screen.findAllByText("$0.0036518")).toHaveLength(2);
  });
});
