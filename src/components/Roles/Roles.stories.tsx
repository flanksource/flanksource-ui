import {
  rbacHandlers,
  roles,
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
  render: () => <RolesTable data={roles} isLoading={false} />
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
