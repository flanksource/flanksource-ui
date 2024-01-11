import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import SubmitPlaybookRunForm from "./../SubmitPlaybookRunForm";
import { RunnablePlaybook } from "../../../../../api/types/playbooks";

const playbook: RunnablePlaybook = {
  id: "1",
  name: "Playbook 1",
  source: "UI",
  parameters: [
    {
      label: "Label",
      name: "name",
      type: "text"
    }
  ],
  created_at: "2021-09-01T00:00:00Z",
  updated_at: "2021-09-01T00:00:00Z"
};

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Define a mock server to handle PATCH requests
const server = setupServer(
  rest.post("/api/playbook/run", (req, res, ctx) => {
    return res(ctx.json(playbook));
  })
);

const queryClient = new QueryClient();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SubmitPlaybookRunForm", () => {
  const componentId = "component-1";
  const checkId = "check-1";
  const configId = "config-1";

  it("should render the form with the correct initial values", async () => {
    const closeFn = jest.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <SubmitPlaybookRunForm
          isOpen={true}
          onClose={closeFn}
          playbook={playbook}
          componentId={componentId}
          checkId={checkId}
          configId={configId}
        />
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: /Playbook 1/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Label")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Run/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(closeFn).toHaveBeenCalled();
    });
  });

  it("should submit the form when the submit button is clicked", async () => {
    const closeFn = jest.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitPlaybookRunForm
          isOpen={true}
          onClose={closeFn}
          playbook={playbook}
          componentId={componentId}
          checkId={checkId}
          configId={configId}
        />
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: /Playbook 1/i })
    ).toBeInTheDocument();

    const input = screen.getByLabelText("Label");

    fireEvent.change(input, { target: { value: "test" } });

    const btn = screen.getByRole("button", { name: /Run/i });

    userEvent.click(btn);

    await waitFor(() => {
      expect(closeFn).toHaveBeenCalledTimes(1);
    });
  });
});
