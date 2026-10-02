import {
  rbacHandlers,
  scopes,
  withAdmin
} from "@flanksource-ui/components/Permissions/Rbac/rbacStoryFixtures";
import { Meta, StoryObj } from "@storybook/react";
import { mswLoader } from "msw-storybook-addon";
import ScopeForm from "./Forms/ScopeForm";
import ScopesTable from "./ScopesTable";

export default {
  title: "Settings/RBAC/Scopes",
  // Hidden from autodocs: a docs page would open the modal of every story at once
  tags: ["!autodocs"],
  decorators: [withAdmin],
  // .storybook/preview sets mswLoader under parameters, where Storybook ignores it
  loaders: [mswLoader],
  parameters: { msw: { handlers: rbacHandlers } }
} satisfies Meta;

export const Table: StoryObj = {
  render: () => <ScopesTable data={scopes} isLoading={false} />
};

export const AddScope: StoryObj<typeof ScopeForm> = {
  render: () => <ScopeForm isOpen onClose={() => {}} />
};

export const EditScope: StoryObj<typeof ScopeForm> = {
  render: () => <ScopeForm isOpen onClose={() => {}} data={scopes[2]} />
};

export const ScopeFromKubernetes: StoryObj<typeof ScopeForm> = {
  render: () => <ScopeForm isOpen onClose={() => {}} data={scopes[4]} />
};
