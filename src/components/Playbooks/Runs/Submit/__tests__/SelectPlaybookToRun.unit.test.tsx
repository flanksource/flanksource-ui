import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { RunnablePlaybook } from "../../../../../api/types/playbooks";
import PlaybooksDropdownMenu from "../PlaybooksDropdownMenu";

const playbooks: (RunnablePlaybook & {
  spec: any;
})[] = [
  {
    id: "1",
    name: "Playbook 1",
    created_at: "2021-09-01T00:00:00Z",
    source: "UI",
    parameters: [],
    updated_at: "2021-09-01T00:00:00Z",
    spec: {
      icon: "playbook.svg"
    }
  },
  {
    id: "2",
    name: "Playbook 2",
    created_at: "2021-09-01T00:00:00Z",
    source: "UI",
    parameters: [],
    updated_at: "2021-09-01T00:00:00Z",
    spec: {
      icon: "playbook.svg"
    }
  }
];

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Define a mock server to handle PATCH requests
const server = setupServer(
  rest.get("/api/playbook/list", (req, res, ctx) => {
    return res(ctx.json(playbooks));
  }),
  rest.get("/api/db/playbooks", (req, res, ctx) => {
    return res(ctx.json(playbooks));
  })
);

const queryClient = new QueryClient();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SelectPlaybookToRun", () => {
  it("should render dropdown list with playbooks", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PlaybooksDropdownMenu component_id="component_id" />
      </QueryClientProvider>
    );

    const playbooksButton = await screen.findByRole("button", {
      name: /playbooks/i
    });

    userEvent.click(playbooksButton);

    expect(await screen.findByText(/playbook 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/playbook 2/i)).toBeInTheDocument();
  });

  it("should open runs page, when you click a playbook item", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PlaybooksDropdownMenu check_id="check_id" />
      </QueryClientProvider>
    );

    const playbooksButton = await screen.findByRole("button", {
      name: /playbooks/i
    });

    userEvent.click(playbooksButton);

    const playbook1 = await screen.findByText(/playbook 1/i);

    userEvent.click(playbook1);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: /playbook 1/i })
      ).toBeInTheDocument();
    });
  });
});
