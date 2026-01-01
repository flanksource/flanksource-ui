import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlaybookSpec } from "../../../../api/types/playbooks";
import PlaybookSpecCard from "./../PlaybookSpecCard";
import * as playbooksApi from "../../../../api/services/playbooks";
import * as configsApi from "../../../../api/services/configs";

// Mock the API functions directly
jest.mock("../../../../api/services/playbooks", () => ({
  ...jest.requireActual("../../../../api/services/playbooks"),
  getPlaybookSpec: jest.fn(),
  getPlaybookParams: jest.fn()
}));

jest.mock("../../../../api/services/configs", () => ({
  ...jest.requireActual("../../../../api/services/configs"),
  getConfigsByIDs: jest.fn()
}));

const mockPlaybook: PlaybookSpec = {
  id: "018cf7b8-9379-a943-4640-70b80e97c158",
  name: "Test Playbook",
  description: "Test Description",
  spec: {
    actions: [
      {
        name: "test-action",
        exec: {
          script: 'echo "{{.}}"'
        }
      }
    ],
    configs: [
      {
        types: ["AWS::EKS::Cluster"]
      }
    ],
    parameters: [
      {
        name: "text-input",
        type: "text",
        label: "Text Input (Default)"
      },
      {
        name: "checkbox",
        type: "checkbox",
        label: "Checkbox"
      }
    ],
    description: "Test playbook"
  },
  source: "UI",
  created_at: "2024-01-11T08:51:57.945373+00:00",
  updated_at: "2024-01-14T23:18:26.592563+00:00",
  created_by: {
    id: "663f826b-6fbb-4c16-98d8-9418f708cb86",
    name: "Admin ",
    email: "",
    avatar: undefined
  },
  title: "Test Playbook"
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

beforeEach(() => {
  (playbooksApi.getPlaybookSpec as jest.Mock).mockResolvedValue(mockPlaybook);
  (playbooksApi.getPlaybookParams as jest.Mock).mockResolvedValue({
    params: [
      {
        name: "text-input",
        type: "text",
        label: "Text Input (Default)"
      },
      {
        name: "checkbox",
        type: "checkbox",
        label: "Checkbox"
      }
    ]
  });
  (configsApi.getConfigsByIDs as jest.Mock).mockResolvedValue([
    {
      id: "018848bc-78d6-e952-10b7-974497e71bbd",
      name: "eksctl-mission-control-demo-cluster-cluster/ControlPlane",
      type: "AWS::EKS::Cluster",
      config_class: "KubernetesCluster"
    }
  ]);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("PlaybookSpecCard", () => {
  it("renders correctly", async () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthContext.Provider value={FakeUser([Roles.admin])}>
            {" "}
            <UserAccessStateContextProvider>
              <PlaybookSpecCard playbook={mockPlaybook} />
            </UserAccessStateContextProvider>
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Test Playbook")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /history/i
      })
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", {
        name: /run/i
      })
    ).toBeInTheDocument();
  });

  it("navigates correctly when the History button is clicked", () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/playbooks/runs"]}>
          <AuthContext.Provider value={FakeUser([Roles.admin])}>
            <UserAccessStateContextProvider>
              <PlaybookSpecCard playbook={mockPlaybook} />
            </UserAccessStateContextProvider>
          </AuthContext.Provider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText("History"));
  });

  it("opens the SubmitPlaybookRunForm when the Run button is clicked", async () => {
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={FakeUser([Roles.admin])}>
          <UserAccessStateContextProvider>
            <MemoryRouter>
              <PlaybookSpecCard playbook={mockPlaybook} />
            </MemoryRouter>
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    );

    expect(
      await screen.findByRole("button", {
        name: /run/i
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /run/i }));

    // expect modal to be opened
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    // expect the correct title, the form will be independently tested
    expect(
      await screen.findByRole("heading", { name: /test playbook/i })
    ).toBeInTheDocument();
  });
});
