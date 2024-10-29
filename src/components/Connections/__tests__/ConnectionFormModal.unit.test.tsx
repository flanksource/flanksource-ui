import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import ConnectionFormModal from "../ConnectionFormModal";
import { ConnectionValueType } from "../connectionTypes";

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

const server = setupServer(
  rest.get("/api/db/people_roles", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: "b149b5ee-db1c-4c0c-9711-98d06f1f1ce7",
          name: "Admin",
          email: "admin@local",
          roles: ["admin"]
        }
      ])
    );
  })
);

const client = new QueryClient();

describe("ConnectionForm", () => {
  const formInitialValue = {
    type: ConnectionValueType.Git,
    name: "Test Connection",
    url: "https://test.com",
    certificate: "test",
    ref: "main"
  };

  const onConnectionSubmit = jest.fn();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form when provided with initial value", async () => {
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionFormModal
              formValue={formInitialValue}
              isOpen={true}
              setIsOpen={() => {}}
              onConnectionDelete={async (data) => {}}
              onConnectionSubmit={onConnectionSubmit}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => screen.findByRole("button", { name: /Save/i }));

    expect(screen.getByLabelText("Name")).toHaveValue("Test Connection");
    expect(screen.getByLabelText("URL")).toHaveValue("https://test.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: /Save/i
      })
    );

    await waitFor(() => {
      expect(onConnectionSubmit).toHaveBeenCalledWith({
        certificate: "test",
        name: "Test Connection",
        password: "",
        properties: {
          ref: "ref"
        },
        type: "git",
        url: "https://test.com",
        username: "",
        namespace: "default"
      });
    });
  });

  it("renders list of connection types", async () => {
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionFormModal
              formValue={undefined}
              isOpen={true}
              setIsOpen={() => {}}
              onConnectionSubmit={async (data) => {}}
              onConnectionDelete={async (data) => {}}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Git")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
  });

  it("renders form when connection type is selected", async () => {
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionFormModal
              formValue={undefined}
              isOpen={true}
              setIsOpen={() => {}}
              onConnectionSubmit={async (data) => {}}
              onConnectionDelete={async (data) => {}}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    fireEvent.click(await screen.findByText("Git"));

    expect(await screen.findByLabelText("URL")).toBeInTheDocument();
  });
});
