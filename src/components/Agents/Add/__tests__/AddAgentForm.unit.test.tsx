import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import AgentForm from "./../AddAgentForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const server = setupServer(
  rest.post("/api/agent/generate", (req, res, ctx) => {
    // @ts-ignore
    return res(ctx.status(201), ctx.json({ id: "123", ...req.body }));
  }),
  rest.patch("/api/db/agents", (req, res, ctx) => {
    // @ts-ignore
    return res(ctx.status(200), ctx.json({ ...req.body }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient({});

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
    render(
      <QueryClientProvider client={queryClient}>
        <AgentForm
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
          onUpdated={onUpdated}
          agent={undefined}
        />
      </QueryClientProvider>
    );

    expect(await screen.findByText("Create new agent")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
  });

  it("renders the form with the correct title and fields when editing an agent", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AgentForm
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
          onUpdated={onUpdated}
          agent={agent}
        />
      </QueryClientProvider>
    );

    expect(await screen.findByText(agent.name)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue(agent.name);
    expect(screen.getByText("Properties")).toBeInTheDocument();
  });

  it("submits the form and calls the addAgent API when creating a new agent", async () => {
    const agentData = { name: "New Agent", properties: {} };
    render(
      <QueryClientProvider client={queryClient}>
        <AgentForm
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
          onUpdated={onUpdated}
          agent={undefined}
        />
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
      expect(onSuccess).toHaveBeenCalledWith({ id: "123", ...agentData });
    });
  });

  it("submits the form and calls the updateAgent API when editing an agent", async () => {
    const agentData = { name: "Updated Agent", properties: {} };
    render(
      <QueryClientProvider client={queryClient}>
        <AgentForm
          isOpen={true}
          onClose={onClose}
          onSuccess={onSuccess}
          onUpdated={onUpdated}
          agent={{
            id: "123",
            name: "Test Agent",
            properties: {}
          }}
        />
      </QueryClientProvider>
    );
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
