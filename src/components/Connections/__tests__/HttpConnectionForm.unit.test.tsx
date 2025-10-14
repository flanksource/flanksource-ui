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

describe("HTTP Connection Form", () => {
  const httpConnectionFormValue = {
    type: ConnectionValueType.HTTP,
    name: "Test HTTP Connection",
    url: "https://test-http.com",
    username: "testuser",
    password: "testpassword",
    insecure_tls: false
  };

  const onConnectionSubmit = jest.fn();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should save HTTP connection with correct data structure", async () => {
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionFormModal
              formValue={httpConnectionFormValue}
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

    expect(screen.getByLabelText("Name")).toHaveValue("Test HTTP Connection");
    expect(screen.getByLabelText("URL")).toHaveValue("https://test-http.com");

    fireEvent.click(
      screen.getByRole("button", {
        name: /Save/i
      })
    );

    await waitFor(() => {
      expect(onConnectionSubmit).toHaveBeenCalledWith({
        name: "Test HTTP Connection",
        url: "https://test-http.com",
        username: "testuser",
        password: "testpassword",
        insecure_tls: false,
        type: "http",
        properties: {}
      });
    });
  });
});
