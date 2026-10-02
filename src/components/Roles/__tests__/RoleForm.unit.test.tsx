import { TooltipProvider } from "@flanksource-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoleForm from "../Forms/RoleForm";

jest.mock("../../../api/services/scopes", () => ({
  getScopes: jest.fn().mockResolvedValue({
    data: [
      {
        id: "1",
        name: "monitoring-playbooks",
        namespace: "monitoring",
        source: "UI",
        targets: [{ playbook: { name: "*" } }]
      },
      {
        id: "2",
        name: "staging-configs",
        namespace: "default",
        source: "UI",
        targets: [{ config: { tagSelector: "env=staging" } }]
      }
    ]
  })
}));

const mockPost = jest.fn();
jest.mock("../../../api/axios", () => ({
  Rback: { post: (...args: unknown[]) => mockPost(...args), put: jest.fn() },
  IncidentCommander: { get: jest.fn().mockResolvedValue({ data: [] }) }
}));

jest.mock("../../Permissions/AuthorizationAccessCheck", () => ({
  AuthorizationAccessCheck: ({ children }: { children: React.ReactNode }) =>
    children
}));

function renderForm(props: Partial<React.ComponentProps<typeof RoleForm>>) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <TooltipProvider>
          <RoleForm isOpen onClose={() => {}} {...props} />
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function selectOption(input: HTMLElement, downPresses: number) {
  fireEvent.focus(input);
  for (let i = 0; i <= downPresses; i++) {
    fireEvent.keyDown(input, { key: "ArrowDown" });
  }
  fireEvent.keyDown(input, { key: "Enter" });
}

beforeEach(() => {
  mockPost.mockReset();
  mockPost.mockResolvedValue({ data: { id: "new" } });
});

it("creates a role in the namespace of the scope it uses", async () => {
  renderForm({});
  await screen.findByText("Add Role");

  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
    target: { value: "ops" }
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Rule name" }), {
    target: { value: "run-monitoring" }
  });

  // playbook:run is the fifth action
  const actionInput = screen.getAllByRole("combobox")[0];
  selectOption(actionInput, 4);
  expect(await screen.findByText("Target scope")).toBeInTheDocument();

  const resourceInput = screen.getByLabelText(/Resource scope/);
  fireEvent.focus(resourceInput);
  fireEvent.keyDown(resourceInput, { key: "ArrowDown" });
  fireEvent.click(await screen.findByText("monitoring-playbooks"));

  expect(await screen.findByText(/created in the/)).toHaveTextContent(
    "monitoring"
  );

  fireEvent.click(screen.getByText("Create"));

  await waitFor(() =>
    expect(mockPost).toHaveBeenCalledWith("/roles", {
      apiVersion: "mission-control.flanksource.com/v1",
      kind: "Role",
      metadata: { name: "ops", namespace: "monitoring" },
      spec: {
        rules: [
          {
            name: "run-monitoring",
            action: "playbook:run",
            resource: { scopeRef: "monitoring-playbooks" }
          }
        ]
      }
    })
  );
});

it("doesn't submit a rule without a scope", async () => {
  renderForm({});
  await screen.findByText("Add Role");

  fireEvent.click(screen.getByText("Create"));

  expect(await screen.findByText("Scope is required")).toBeInTheDocument();
  expect(mockPost).not.toHaveBeenCalled();
});

it("shows a role from a CRD read-only, with why it isn't in effect", async () => {
  renderForm({
    data: {
      id: "r",
      name: "ops",
      namespace: "default",
      source: "KubernetesCRD",
      error: "scope missing-scope not found",
      error_reason: "ScopeNotFound",
      rules: [
        { name: "read", action: "read", resource: { scopeRef: "missing" } }
      ],
      created_at: "",
      updated_at: ""
    }
  });

  expect(
    await screen.findByText(/managed by a Kubernetes CRD/)
  ).toBeInTheDocument();
  expect(screen.getByText("scope missing-scope not found")).toBeInTheDocument();
  expect(screen.queryByText("Save")).not.toBeInTheDocument();
  expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  expect(
    await screen.findByText(/No role binding grants this role/)
  ).toBeInTheDocument();
});
