import { TooltipProvider } from "@flanksource-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoleBindingForm from "../Forms/RoleBindingForm";

jest.mock("../../../api/services/roles", () => ({
  getRoles: jest.fn().mockResolvedValue([
    {
      id: "r1",
      name: "operator",
      namespace: "monitoring",
      source: "UI",
      rules: [
        { name: "read", action: "read", resource: { scopeRef: "configs" } },
        {
          name: "run",
          action: "playbook:run",
          resource: { scopeRef: "playbooks" }
        },
        {
          name: "no-delete",
          action: "delete",
          resource: { scopeRef: "configs" },
          deny: true
        }
      ]
    }
  ])
}));

jest.mock("../../../api/services/scopes", () => ({
  getScopes: jest.fn().mockResolvedValue({
    data: [
      {
        id: "s1",
        name: "configs",
        namespace: "monitoring",
        targets: [{ config: { name: "*" } }]
      },
      {
        id: "s2",
        name: "playbooks",
        namespace: "monitoring",
        targets: [{ playbook: { name: "*" } }]
      },
      {
        id: "s3",
        name: "tenant-a",
        namespace: "monitoring",
        targets: [{ config: { tagSelector: "tenant=a" } }]
      }
    ]
  })
}));

jest.mock("../../../api/services/users", () => ({
  fetchPeopleWithRoles: jest.fn().mockResolvedValue({ data: [] })
}));

jest.mock("../../../api/query-hooks/responders", () => ({
  useGetAllTeams: () => ({
    data: [{ id: "t1", name: "platform" }],
    isLoading: false
  })
}));

const mockPost = jest.fn();
jest.mock("../../../api/axios", () => ({
  Rback: { post: (...args: unknown[]) => mockPost(...args), put: jest.fn() }
}));

jest.mock("../../Permissions/AuthorizationAccessCheck", () => ({
  AuthorizationAccessCheck: ({ children }: { children: React.ReactNode }) =>
    children
}));

function renderForm(
  props: Partial<React.ComponentProps<typeof RoleBindingForm>> = {}
) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <TooltipProvider>
          <RoleBindingForm isOpen onClose={() => {}} {...props} />
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function pickFirstOption(input: HTMLElement) {
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });
}

beforeEach(() => {
  mockPost.mockReset();
  mockPost.mockResolvedValue({ data: { id: "new" } });
});

it("creates a binding with the role's namespace and its constraint", async () => {
  renderForm();
  await screen.findByText("Add Role Binding");

  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
    target: { value: "platform-operators" }
  });

  const roleInput = screen.getByLabelText(/^Role/);
  fireEvent.focus(roleInput);
  fireEvent.keyDown(roleInput, { key: "ArrowDown" });
  fireEvent.click(await screen.findByText("operator"));
  expect(await screen.findByText(/created in the/)).toHaveTextContent(
    "monitoring"
  );

  // Only subjects that are added are shown
  expect(screen.queryByLabelText("Teams")).not.toBeInTheDocument();
  // The menu opens on pointer down or Enter, which jsdom only supports by key
  fireEvent.keyDown(screen.getByText("Add subject"), { key: "Enter" });
  fireEvent.click(await screen.findByRole("menuitem", { name: "Teams" }));
  pickFirstOption(screen.getByLabelText("Teams"));

  const resourceInput = screen.getByLabelText("Resource");
  fireEvent.focus(resourceInput);
  fireEvent.keyDown(resourceInput, { key: "ArrowDown" });
  fireEvent.click(await screen.findByText("tenant-a"));

  // tenant-a selects configs only: it narrows read, but shares no type with run's playbooks
  const rows = screen.getAllByRole("row");
  expect(rows[1]).toHaveTextContent(/read.*Narrowed to config.*Yes/);
  expect(rows[2]).toHaveTextContent(/run.*No type in common.*No/);
  expect(
    screen.getByText(
      /Deny rules are never narrowed and always apply: no-delete/
    )
  ).toBeInTheDocument();

  fireEvent.click(screen.getByText("Create"));

  await waitFor(() =>
    expect(mockPost).toHaveBeenCalledWith("/role-bindings", {
      apiVersion: "mission-control.flanksource.com/v1",
      kind: "RoleBinding",
      metadata: { name: "platform-operators", namespace: "monitoring" },
      spec: {
        role: "operator",
        subjects: { teams: ["platform"] },
        constraint: { resource: { scopeRef: "tenant-a" } }
      }
    })
  );
});

it("doesn't submit without a subject", async () => {
  renderForm();
  await screen.findByText("Add Role Binding");

  fireEvent.click(screen.getByText("Create"));

  expect(
    await screen.findByText("At least one subject is required")
  ).toBeInTheDocument();
  expect(mockPost).not.toHaveBeenCalled();
});

it("shows only the subjects an existing binding uses", async () => {
  renderForm({
    data: {
      id: "b1",
      name: "ops",
      namespace: "monitoring",
      source: "UI",
      role: "operator",
      subjects: {
        people: ["alice@example.com"],
        scrapers: [{ name: "*" }]
      },
      created_at: "",
      updated_at: ""
    }
  });

  expect(await screen.findByText("alice@example.com")).toBeInTheDocument();
  expect(screen.getByDisplayValue("*")).toBeInTheDocument();
  expect(screen.queryByLabelText("Teams")).not.toBeInTheDocument();

  // Removing a subject clears it
  fireEvent.click(screen.getByTitle("Remove people"));
  expect(screen.queryByText("alice@example.com")).not.toBeInTheDocument();
});
