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
  getScopes: jest.fn().mockResolvedValue({ data: [] })
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

function renderForm() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <TooltipProvider>
          <RoleBindingForm isOpen onClose={() => {}} />
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

it("creates a binding with the role's namespace and its constraints", async () => {
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

  pickFirstOption(screen.getByLabelText("Teams"));

  fireEvent.click(screen.getByText("Add constraint"));
  // Deny rules can't be constrained, so only read and run are offered
  const ruleInput = screen.getByLabelText(/^Rule/);
  fireEvent.focus(ruleInput);
  fireEvent.keyDown(ruleInput, { key: "ArrowDown" });
  expect(screen.queryByText("no-delete")).not.toBeInTheDocument();
  fireEvent.keyDown(ruleInput, { key: "ArrowDown" });
  fireEvent.keyDown(ruleInput, { key: "Enter" });

  fireEvent.click(screen.getByText("Create"));

  await waitFor(() =>
    expect(mockPost).toHaveBeenCalledWith("/role-bindings", {
      apiVersion: "mission-control.flanksource.com/v1",
      kind: "RoleBinding",
      metadata: { name: "platform-operators", namespace: "monitoring" },
      spec: {
        role: "operator",
        subjects: { teams: ["platform"] },
        constraints: [{ rule: "run" }]
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
