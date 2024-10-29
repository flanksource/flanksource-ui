import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { PlaybookSpec } from "../../../../api/types/playbooks";
import PlaybookSpecCard from "./../PlaybookSpecCard";

const mockPlaybook: PlaybookSpec = {
  id: "018cf7b8-9379-a943-4640-70b80e97c158",
  name: "Test Playbook",
  description: "Test Description",
  spec: {
    actions: [
      {
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

const client = new QueryClient();

const server = setupServer(
  rest.get("/api/db/config_items", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: "018848bc-78d6-e952-10b7-974497e71bbd",
          name: "eksctl-mission-control-demo-cluster-cluster/ControlPlane",
          type: "AWS::EKS::Cluster",
          config_class: "KubernetesCluster"
        }
      ])
    );
  }),
  rest.get("/api/db/playbooks", (req, res, ctx) => {
    return res(ctx.json([mockPlaybook]));
  }),
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

describe("PlaybookSpecCard", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders correctly", async () => {
    render(
      <QueryClientProvider client={client}>
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
    render(
      <QueryClientProvider client={client}>
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
    render(
      <QueryClientProvider client={client}>
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
