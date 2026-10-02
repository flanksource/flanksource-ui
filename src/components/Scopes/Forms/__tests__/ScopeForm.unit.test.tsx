import { TooltipProvider } from "@flanksource-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ScopeForm from "../ScopeForm";

jest.mock("../../../../api/query-hooks", () => ({
  useAllAgentNamesQuery: () => ({ data: [], isLoading: false })
}));

const mockPost = jest.fn();
jest.mock("../../../../api/axios", () => ({
  Rback: { post: (...args: unknown[]) => mockPost(...args), put: jest.fn() }
}));

jest.mock("../../../Permissions/AuthorizationAccessCheck", () => ({
  AuthorizationAccessCheck: ({ children }: { children: React.ReactNode }) =>
    children
}));

function renderForm() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <TooltipProvider>
          <ScopeForm isOpen onClose={() => {}} />
        </TooltipProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  mockPost.mockReset();
  mockPost.mockResolvedValue({ data: { id: "new" } });
});

it("creates a scope in the namespace entered, default unless changed", async () => {
  renderForm();
  await screen.findByText("Add Scope");

  const namespace = screen.getByRole("textbox", { name: /Namespace/ });
  expect(namespace).toHaveValue("default");

  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), {
    target: { value: "staging-configs" }
  });
  fireEvent.change(namespace, { target: { value: "monitoring" } });
  fireEvent.click(screen.getByLabelText("Match all (wildcard)"));

  fireEvent.click(screen.getByText("Create"));

  await waitFor(() => expect(mockPost).toHaveBeenCalled());
  expect(mockPost.mock.calls[0][0]).toBe("/scopes");
  expect(mockPost.mock.calls[0][1].metadata).toEqual({
    name: "staging-configs",
    namespace: "monitoring"
  });
});

it("rejects a namespace the API would reject", async () => {
  renderForm();
  await screen.findByText("Add Scope");

  fireEvent.change(screen.getByRole("textbox", { name: /Namespace/ }), {
    target: { value: "Not Valid" }
  });
  fireEvent.click(screen.getByText("Create"));

  expect(
    await screen.findByText(/Use lowercase letters, numbers and '-'/)
  ).toBeInTheDocument();
  expect(mockPost).not.toHaveBeenCalled();
});
