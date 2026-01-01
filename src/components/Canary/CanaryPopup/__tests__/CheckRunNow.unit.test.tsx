import { UserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CheckRunNow from "../CheckRunNow";
import * as topologyApi from "../../../../api/services/topology";

// Mock the API function directly
jest.mock("../../../../api/services/topology", () => ({
  ...jest.requireActual("../../../../api/services/topology"),
  runHealthCheckNow: jest.fn()
}));

const mockRunResponse = {
  total: 10,
  success: 7,
  failed: 3,
  errors: []
};

beforeEach(() => {
  (topologyApi.runHealthCheckNow as jest.Mock).mockResolvedValue({
    data: mockRunResponse
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

describe("CheckRunNow", () => {
  it("renders the Run Now button and shows the modal with results when clicked", async () => {
    const queryClient = createQueryClient();
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
    const queryClient = createQueryClient();
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
