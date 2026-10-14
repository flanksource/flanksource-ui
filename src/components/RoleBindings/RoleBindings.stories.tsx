import {
  rbacHandlers,
  roleBindings,
  withAdmin
} from "@flanksource-ui/components/Permissions/Rbac/rbacStoryFixtures";
import { Meta, StoryObj } from "@storybook/react";
import { AuthContext, FakeUser } from "@flanksource-ui/context";
import { UserAccessStateContextProvider } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { mswLoader } from "msw-storybook-addon";
import RoleBindingForm from "./Forms/RoleBindingForm";
import RoleBindingsTable from "./RoleBindingsTable";

export default {
  title: "Settings/RBAC/Role Bindings",
  // Hidden from autodocs: a docs page would open the modal of every story at once
  tags: ["!autodocs"],
  decorators: [withAdmin],
  // .storybook/preview sets mswLoader under parameters, where Storybook ignores it
  loaders: [mswLoader],
  parameters: { msw: { handlers: rbacHandlers } }
} satisfies Meta;

export const Table: StoryObj = {
  render: () => <RoleBindingsTable data={roleBindings} isLoading={false} />
};

export const AddRoleBinding: StoryObj<typeof RoleBindingForm> = {
  render: () => <RoleBindingForm isOpen onClose={() => {}} />
};

export const EditRoleBinding: StoryObj<typeof RoleBindingForm> = {
  render: () => (
    <RoleBindingForm isOpen onClose={() => {}} data={roleBindings[0]} />
  )
};

export const WithConstraints: StoryObj<typeof RoleBindingForm> = {
  render: () => (
    <RoleBindingForm isOpen onClose={() => {}} data={roleBindings[1]} />
  )
};

export const RoleBindingFromKubernetes: StoryObj<typeof RoleBindingForm> = {
  render: () => (
    <RoleBindingForm isOpen onClose={() => {}} data={roleBindings[2]} />
  )
};

export const PluginSubjects: StoryObj<typeof RoleBindingForm> = {
  render: () => (
    <RoleBindingForm
      isOpen
      onClose={() => {}}
      data={{
        ...roleBindings[0],
        name: "plugin-connections",
        subjects: { plugins: [{ namespace: "integrations", name: "logs" }] },
        error:
          "Plugin subjects require connection-only read or connection:use rules",
        error_reason: "InvalidRole"
      }}
    />
  )
};

export const AllHumanUsers: StoryObj<typeof RoleBindingForm> = {
  render: () => (
    <RoleBindingForm
      isOpen
      onClose={() => {}}
      data={{
        ...roleBindings[0],
        name: "all-human-viewers",
        subjects: { people: ["*"] }
      }}
    />
  )
};

export const WithoutCatalogueAccess: StoryObj<typeof RoleBindingForm> = {
  render: () => (
    <AuthContext.Provider
      value={FakeUser([], {
        roleBinding: {
          read: "all",
          create: "all",
          update: "all",
          delete: "all"
        }
      })}
    >
      <UserAccessStateContextProvider>
        <RoleBindingForm isOpen onClose={() => {}} />
      </UserAccessStateContextProvider>
    </AuthContext.Provider>
  )
};
