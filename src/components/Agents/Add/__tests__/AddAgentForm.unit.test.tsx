import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AgentForm from "./../AddAgentForm";
import * as agentsApi from "../../../../api/services/agents";

// Mock the API functions directly
jest.mock("../../../../api/services/agents", () => ({
  ...jest.requireActual("../../../../api/services/agents"),
  addAgent: jest.fn(),
  updateAgent: jest.fn(),
  getAgentsSummaryByID: jest.fn()
}));

const mockAgent = {
  id: "123",
  name: "Test Agent",
  properties: {}
};

beforeEach(() => {
  // Mock addAgent to return the input merged with generated data (matching original MSW behavior)
  (agentsApi.addAgent as jest.Mock).mockImplementation((agent) =>
    Promise.resolve({
      id: "123",
      ...agent
    })
  );
  (agentsApi.updateAgent as jest.Mock).mockResolvedValue(mockAgent);
  (agentsApi.getAgentsSummaryByID as jest.Mock).mockResolvedValue(mockAgent);
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

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe("AgentForm", () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();
  const onUpdated = jest.fn();
  const agent = { id: "123", name: "Test Agent", properties: {} };

  it("renders the form with the correct title and fields", async () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <AgentForm
              isOpen={true}
              onClose={onClose}
              onSuccess={onSuccess}
              onUpdated={onUpdated}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText("Create new agent")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
  });

  it("renders the form with the correct title and fields when editing an agent", async () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <AgentForm
              id="123"
              isOpen={true}
              onClose={onClose}
              onSuccess={onSuccess}
              onUpdated={onUpdated}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    expect(await screen.findByText(agent.name)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue(agent.name);
    expect(screen.getByText("Properties")).toBeInTheDocument();
  });

  it("submits the form and calls the addAgent API when creating a new agent", async () => {
    const queryClient = createQueryClient();
    const agentData = { name: "New Agent", properties: {} };
    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <AgentForm
              isOpen={true}
              onClose={onClose}
              onSuccess={onSuccess}
              onUpdated={onUpdated}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );
    const nameInput = await screen.findByLabelText("Name");
    const saveButton = await screen.findByRole("button", {
      name: /next/i
    });
    fireEvent.change(nameInput, {
      target: { value: agentData.name }
    });
    userEvent.click(saveButton);
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ id: "123", ...agentData }),
        undefined
      );
    });
  });

  it("submits the form and calls the updateAgent API when editing an agent", async () => {
    const queryClient = createQueryClient();
    const agentData = { name: "Updated Agent", properties: {} };
    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <AgentForm
              id="123"
              isOpen={true}
              onClose={onClose}
              onSuccess={onSuccess}
              onUpdated={onUpdated}
            />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/test agent/i)).toBeInTheDocument();
    });

    const nameInput = await screen.findByLabelText("Name");
    const saveButton = await screen.findByRole("button", {
      name: /save/i
    });
    fireEvent.change(nameInput, {
      target: { value: agentData.name }
    });
    userEvent.click(saveButton);
    await waitFor(() => {
      expect(onUpdated).toHaveBeenCalled();
    });
  });
});
