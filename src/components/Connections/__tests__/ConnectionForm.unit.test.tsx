import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  ConnectionType,
  ConnectionValueType,
  connectionTypes
} from "../connectionTypes";
import ConnectionForm from "./../ConnectionForm";

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

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const client = new QueryClient();

describe("ConnectionForm", () => {
  const connectionType: ConnectionType = connectionTypes.find(
    (type) => type.value === ConnectionValueType.Git
  )!;

  const formInitialValue = {
    name: "Test Connection",
    url: "https://test.com",
    certificate: "test",
    ref: "main"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form fields", () => {
    render(
      <ConnectionForm
        connectionType={connectionType}
        formValue={formInitialValue}
      />
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Test Connection");
    expect(screen.getByLabelText("URL")).toHaveValue("https://test.com");
  });

  it("calls onConnectionSubmit when the form is submitted", async () => {
    const onConnectionSubmit = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionForm
              connectionType={connectionType}
              formValue={formInitialValue}
              onConnectionSubmit={onConnectionSubmit}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("button", { name: /Save/i })
    ).toBeInTheDocument();

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

  it("calls onConnectionDelete when the delete button is clicked", async () => {
    const onConnectionDelete = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionForm
              connectionType={connectionType}
              formValue={{ ...formInitialValue, id: "123" }}
              onConnectionDelete={onConnectionDelete}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));
    expect(onConnectionDelete).toHaveBeenCalledWith({
      name: "Test Connection",
      url: "https://test.com",
      ref: "main",
      certificate: "test",
      id: "123"
    });
  });

  it("should show connection test button", () => {
    const onConnectionDelete = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionForm
              connectionType={connectionType}
              formValue={{ ...formInitialValue, id: "123" }}
              onConnectionDelete={onConnectionDelete}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
    expect(
      screen.getByRole("button", {
        name: /Test Connection/i
      })
    ).toBeInTheDocument();
  });

  it("calls handleBack when the back button is clicked", () => {
    const handleBack = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionForm
              connectionType={connectionType}
              formValue={formInitialValue}
              handleBack={handleBack}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("Back"));
    expect(handleBack).toHaveBeenCalled();
  });

  it("shows read-only warning when source is KubernetesCRD", () => {
    const formValueWithCRD = {
      ...formInitialValue,
      source: "KubernetesCRD",
      id: "123"
    };

    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionForm
              connectionType={connectionType}
              formValue={formValueWithCRD}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    expect(
      screen.getByText(
        "Read-Only Mode: This resource is managed by Kubernetes CRD and cannot be edited from the UI."
      )
    ).toBeInTheDocument();
  });

  it("disables form fields when source is KubernetesCRD", () => {
    const formValueWithCRD = {
      ...formInitialValue,
      source: "KubernetesCRD",
      id: "123"
    };

    render(
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <ConnectionForm
              connectionType={connectionType}
              formValue={formValueWithCRD}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    const nameField = screen.getByLabelText("Name");
    const urlField = screen.getByLabelText("URL");

    expect(nameField).toBeDisabled();
    expect(urlField).toBeDisabled();
  });
});
