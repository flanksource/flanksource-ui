import {
  rbacHandlers,
  roleBindings,
  withAdmin
} from "@flanksource-ui/components/Permissions/Rbac/rbacStoryFixtures";
import { Meta, StoryObj } from "@storybook/react";
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
