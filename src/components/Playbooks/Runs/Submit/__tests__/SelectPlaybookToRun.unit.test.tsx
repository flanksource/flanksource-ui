import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { render, screen, waitFor } from "@flanksource-ui/test-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { RunnablePlaybook } from "../../../../../api/types/playbooks";
import PlaybooksDropdownMenu from "../PlaybooksDropdownMenu";
import * as playbooksApi from "../../../../../api/services/playbooks";

// Mock the API functions directly
jest.mock("../../../../../api/services/playbooks", () => ({
  ...jest.requireActual("../../../../../api/services/playbooks"),
  getPlaybookToRunForResource: jest.fn(),
  getPlaybookSpecsByIDs: jest.fn(),
  getPlaybookParams: jest.fn()
}));

const playbooks: (RunnablePlaybook & {
  spec: any;
})[] = [
  {
    id: "1",
    name: "Playbook 1",
    title: "Playbook 1",
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
    title: "Playbook 2",
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

beforeEach(() => {
  (playbooksApi.getPlaybookToRunForResource as jest.Mock).mockResolvedValue(
    playbooks
  );
  (playbooksApi.getPlaybookSpecsByIDs as jest.Mock).mockResolvedValue(
    playbooks.map((p) => ({ id: p.id, title: p.title, spec: p.spec }))
  );
  (playbooksApi.getPlaybookParams as jest.Mock).mockResolvedValue({
    params: []
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

describe("SelectPlaybookToRun", () => {
  it("should render dropdown list with playbooks", async () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <PlaybooksDropdownMenu component_id="component_id" />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    const playbooksButton = await screen.findByRole(
      "button",
      {
        name: /playbooks/i
      },
      {
        timeout: 3000
      }
    );

    userEvent.click(playbooksButton);

    expect(await screen.findByText(/playbook 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/playbook 2/i)).toBeInTheDocument();
  });

  it("should open runs page, when you click a playbook item", async () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <PlaybooksDropdownMenu check_id="check_id" />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
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
