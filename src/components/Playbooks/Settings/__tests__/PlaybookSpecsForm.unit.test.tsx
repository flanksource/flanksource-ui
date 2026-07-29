// ABOUTME: Tests that the playbook spec form is read-only for playbooks owned
// outside the UI, and stays fully editable for UI-created playbooks.
import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { AuthContext, FakeUser, Roles } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlaybookSpecsForm from "./../PlaybookSpecsForm";

// The spec editor lazy-loads Monaco, which never mounts under jsdom. Stub it so
// the `disabled` prop the form passes down is observable.
jest.mock("../../../Forms/Formik/FormikCodeEditor", () => ({
  FormikCodeEditor: ({
    fieldName,
    label,
    disabled
  }: {
    fieldName: string;
    label?: string;
    disabled?: boolean;
  }) => (
    <textarea
      aria-label={label ?? fieldName}
      disabled={disabled}
      readOnly
      value=""
    />
  )
}));

const client = new QueryClient();

const mockPlaybook: PlaybookSpec = {
  id: "018cf7b8-9379-a943-4640-70b80e97c158",
  name: "Test Playbook",
  namespace: "mission-control",
  title: "Test Playbook",
  description: "Test Description",
  spec: {
    actions: [{ name: "test-action", exec: { script: "echo hello" } }]
  },
  source: "UI",
  created_at: "2024-01-11T08:51:57.945373+00:00",
  updated_at: "2024-01-14T23:18:26.592563+00:00"
};

function renderForm(playbook?: PlaybookSpec, roles: string[] = [Roles.admin]) {
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <AuthContext.Provider value={FakeUser(roles)}>
          <UserAccessStateContextProvider>
            <PlaybookSpecsForm playbook={playbook} onClose={() => {}} />
          </UserAccessStateContextProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

describe("PlaybookSpecsForm", () => {
  describe("when the playbook is managed by a Kubernetes CRD", () => {
    const crdPlaybook: PlaybookSpec = {
      ...mockPlaybook,
      source: "KubernetesCRD"
    };

    it("shows a read-only notice", () => {
      renderForm(crdPlaybook);
      expect(
        screen.getByText(/managed by Kubernetes CRD and cannot be edited/i)
      ).toBeInTheDocument();
    });

    it("disables the title and spec fields", () => {
      renderForm(crdPlaybook);
      expect(screen.getByLabelText("Title")).toBeDisabled();
      expect(screen.getByLabelText("Spec")).toBeDisabled();
    });

    it("replaces the update button with a link to the CRD", async () => {
      renderForm(crdPlaybook);
      expect(await screen.findByText(/CRD linked to/i)).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Update/i })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /mission-control\/Test Playbook/i })
      ).toHaveAttribute("href", `/catalog/${crdPlaybook.id}`);
    });

    it("hides the delete button", () => {
      renderForm(crdPlaybook);
      expect(
        screen.queryByRole("button", { name: /Delete/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("when the playbook is managed by a config file", () => {
    const configFilePlaybook: PlaybookSpec = {
      ...mockPlaybook,
      source: "ConfigFile"
    };

    it("shows a read-only notice and disables the fields", () => {
      renderForm(configFilePlaybook);
      expect(
        screen.getByText(/managed by a local file and cannot be edited/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Title")).toBeDisabled();
      expect(screen.getByLabelText("Spec")).toBeDisabled();
    });

    it("replaces the update button with the source of the playbook", async () => {
      renderForm(configFilePlaybook);
      expect(
        await screen.findByText(/Linked to local file/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Update/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("when the user cannot write playbooks", () => {
    it("renders neither mutation button for an existing playbook", async () => {
      renderForm(mockPlaybook, [Roles.viewer]);
      expect(await screen.findByLabelText("Title")).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /Update/i })
        ).not.toBeInTheDocument();
      });
      expect(
        screen.queryByRole("button", { name: /Delete/i })
      ).not.toBeInTheDocument();
    });

    it("renders no save button when creating a playbook", async () => {
      renderForm(undefined, [Roles.viewer]);
      expect(await screen.findByLabelText("Title")).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /Save/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("when the playbook has no source", () => {
    it("is read-only, since only UI playbooks are editable", () => {
      renderForm({ ...mockPlaybook, source: undefined as any });
      expect(
        screen.getByText(/cannot be edited from the UI/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Title")).toBeDisabled();
      expect(screen.getByLabelText("Spec")).toBeDisabled();
    });
  });

  describe("when creating a new playbook", () => {
    it("keeps the form editable", async () => {
      renderForm(undefined);
      expect(
        screen.queryByText(/cannot be edited from the UI/i)
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText("Title")).toBeEnabled();
      expect(screen.getByLabelText("Spec")).toBeEnabled();
      expect(
        await screen.findByRole("button", { name: /Save/i })
      ).toBeInTheDocument();
    });
  });

  describe("when the playbook was created in the UI", () => {
    it("keeps the form editable", async () => {
      renderForm(mockPlaybook);
      expect(
        screen.queryByText(/cannot be edited from the UI/i)
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText("Title")).toBeEnabled();
      expect(screen.getByLabelText("Spec")).toBeEnabled();
      expect(
        await screen.findByRole("button", { name: /Update/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Delete/i })
      ).toBeInTheDocument();
    });
  });
});
