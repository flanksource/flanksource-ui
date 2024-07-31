import { fireEvent, render, screen, waitFor } from "@flanksource-ui/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  PlaybookSpec,
  RunnablePlaybook
} from "../../../../../api/types/playbooks";
import SubmitPlaybookRunForm from "./../SubmitPlaybookRunForm";

const playbook: RunnablePlaybook & {
  spec: PlaybookSpec["spec"];
} = {
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
  updated_at: "2021-09-01T00:00:00Z",
  spec: {
    icon: "playbook.svg",
    components: [
      {
        type: "kubernetes",
        tags: ["kubernetes"]
      }
    ]
  }
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
  }),
  rest.get("/api/db/playbooks", (req, res, ctx) => {
    return res(ctx.json(playbook));
  }),
  rest.post("/api/playbook/:id/params", (req, res, ctx) => {
    return res(
      ctx.json({
        params: [
          {
            label: "Label",
            name: "name",
            type: "text",
            default: "default"
          }
        ]
      })
    );
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

    expect(await screen.findByLabelText("Label")).toBeInTheDocument();

    // The default value should be set
    expect(screen.getByLabelText("Label")).toHaveValue("default");

    expect(screen.getByRole("button", { name: /Run/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(closeFn).toHaveBeenCalled();
    });
  });

  it("should submit the form when the submit button is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubmitPlaybookRunForm
          isOpen={true}
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

    expect(await screen.findByLabelText("Label")).toBeInTheDocument();

    const input = screen.getByLabelText("Label");

    fireEvent.change(input, { target: { value: "test" } });

    const btn = screen.getByRole("button", { name: /Run/i });

    userEvent.click(btn);
  });
});
