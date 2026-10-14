import {
  legacyDenyRole,
  platformAdminRole,
  rbacHandlers,
  roles,
  scopeShapeRole,
  withAdmin
} from "@flanksource-ui/components/Permissions/Rbac/rbacStoryFixtures";
import { Meta, StoryObj } from "@storybook/react";
import { mswLoader } from "msw-storybook-addon";
import RoleForm from "./Forms/RoleForm";
import RolesTable from "./RolesTable";

export default {
  title: "Settings/RBAC/Roles",
  // Hidden from autodocs: a docs page would open the modal of every story at once
  tags: ["!autodocs"],
  decorators: [withAdmin],
  // .storybook/preview sets mswLoader under parameters, where Storybook ignores it
  loaders: [mswLoader],
  parameters: { msw: { handlers: rbacHandlers } }
} satisfies Meta;

export const Table: StoryObj = {
  render: () => (
    <RolesTable
      data={[...roles, platformAdminRole, scopeShapeRole, legacyDenyRole]}
      isLoading={false}
    />
  )
};

export const AddRole: StoryObj<typeof RoleForm> = {
  render: () => <RoleForm isOpen onClose={() => {}} />
};

export const EditRole: StoryObj<typeof RoleForm> = {
  render: () => <RoleForm isOpen onClose={() => {}} data={roles[0]} />
};

export const RoleNotInEffect: StoryObj<typeof RoleForm> = {
  render: () => <RoleForm isOpen onClose={() => {}} data={roles[1]} />
};

export const RoleFromKubernetes: StoryObj<typeof RoleForm> = {
  render: () => <RoleForm isOpen onClose={() => {}} data={roles[2]} />
};

// Actions without a resource take no scope; person:manage and job:read are as privileged as admin
export const ResourcelessActions: StoryObj<typeof RoleForm> = {
  render: () => <RoleForm isOpen onClose={() => {}} data={platformAdminRole} />
};

// Not in effect, with scopes that don't fit their actions and bindings the rules don't apply through
export const ScopeShapeWarnings: StoryObj<typeof RoleForm> = {
  render: () => <RoleForm isOpen onClose={() => {}} data={scopeShapeRole} />
};

// A role saved before deny was rejected can't be saved until its deny rule is removed
export const LegacyDenyRule: StoryObj<typeof RoleForm> = {
  render: () => <RoleForm isOpen onClose={() => {}} data={legacyDenyRole} />
};

export const LegacyDenyRuleFromKubernetes: StoryObj<typeof RoleForm> = {
  render: () => (
    <RoleForm
      isOpen
      onClose={() => {}}
      data={{ ...legacyDenyRole, source: "KubernetesCRD" }}
    />
  )
};
