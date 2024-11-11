import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import DeleteAgentButton from "./../DeleteAgentButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const server = setupServer(
  rest.patch("/api/db/agents", (req, res, ctx) => {
    return res(ctx.status(204));
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

describe("DeleteAgentButton", () => {
  const onDeleted = jest.fn();

  it("renders the button with the correct text and icon", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteAgentButton agentId="123" onDeleted={onDeleted} />
      </QueryClientProvider>
    );

    await expect(
      screen.findByRole("button", {
        name: /delete/i
      })
    ).resolves.toBeInTheDocument();
  });

  it("opens the cleanup dialog when clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteAgentButton agentId="123" onDeleted={onDeleted} />
      </QueryClientProvider>
    );

    await expect(
      screen.findByRole("button", {
        name: /delete/i
      })
    ).resolves.toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: /delete/i
    });

    userEvent.click(deleteButton);
    await expect(
      screen.findByText("Delete Agents Resources")
    ).resolves.toBeInTheDocument();
  });

  it("calls the delete API when confirmed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteAgentButton agentId="123" onDeleted={onDeleted} />
      </QueryClientProvider>
    );

    const deleteButton = await screen.findByRole("button", {
      name: /delete/i
    });
    userEvent.click(deleteButton);
    const yesButton = await screen.findByText("Yes");
    userEvent.click(yesButton);
    expect(
      await screen.findByText("Are you sure you want to delete agent?")
    ).toBeInTheDocument();
    const confirmButton = screen.getByTestId("confirm-button-Delete");
    userEvent.click(confirmButton);
    await waitFor(() => {
      expect(onDeleted).toHaveBeenCalled();
    });
  });
});
