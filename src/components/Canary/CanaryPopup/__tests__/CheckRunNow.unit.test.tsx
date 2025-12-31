import { UserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import CheckRunNow from "../CheckRunNow";

const queryClient = new QueryClient();

const handlers = [
  http.post("/api/canary/run/check/*", () => {
    return HttpResponse.json({
      total: 10,
      success: 7,
      failed: 3,
      errors: []
    });
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("CheckRunNow", () => {
  it("renders the Run Now button and shows the modal with results when clicked", async () => {
    const onSuccessfulRun = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <UserAccessStateContext.Provider
          value={{
            refresh: jest.fn(),
            isAdmin: true,
            isViewer: false,
            hasResourceAccess: jest.fn(),
            hasAnyResourceAccess: jest.fn(),
            roles: ["admin"]
          }}
        >
          <CheckRunNow
            check={{ id: "1", name: "Test Check" }}
            onSuccessfulRun={onSuccessfulRun}
          />
        </UserAccessStateContext.Provider>
      </QueryClientProvider>
    );

    expect(
      screen.getByRole("button", { name: /Run Now/i })
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /Run Now/i }));

    await waitFor(() => {
      expect(onSuccessfulRun).toHaveBeenCalled();
    });

    expect(onSuccessfulRun.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "errors": [],
        "failed": 3,
        "success": 7,
        "total": 10,
      }
    `);
  });

  it("shouldn't show run now button, if user isn't allowed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserAccessStateContext.Provider
          value={{
            refresh: jest.fn(),
            isAdmin: true,
            isViewer: false,
            hasResourceAccess: jest.fn(),
            hasAnyResourceAccess: jest.fn(),
            roles: ["guest"]
          }}
        >
          <CheckRunNow check={{ id: "1", name: "Test Check" }} />
        </UserAccessStateContext.Provider>
      </QueryClientProvider>
    );

    expect(
      screen.queryByRole("button", { name: /Run Now/i })
    ).not.toBeInTheDocument();
  });
});
