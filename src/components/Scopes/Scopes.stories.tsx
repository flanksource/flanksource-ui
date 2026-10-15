import {
  rbacHandlers,
  scopes,
  withAdmin
} from "@flanksource-ui/components/Permissions/Rbac/rbacStoryFixtures";
import { Meta, StoryObj } from "@storybook/react";
import { mswLoader } from "msw-storybook-addon";
import { HttpResponse, http } from "msw";
import ScopeForm from "./Forms/ScopeForm";
import ScopesTable from "./ScopesTable";

export default {
  title: "Settings/RBAC/Scopes",
  // Hidden from autodocs: a docs page would open the modal of every story at once
  tags: ["!autodocs"],
  decorators: [withAdmin],
  // .storybook/preview sets mswLoader under parameters, where Storybook ignores it
  loaders: [mswLoader],
  parameters: {
    msw: {
      handlers: [
        http.get("*/api/db/agents", () =>
          HttpResponse.json([
            {
              id: "18c033db-5a3d-4a2b-844c-49057b2179c9",
              name: "production-agent"
            }
          ])
        ),
        ...rbacHandlers
      ]
    }
  }
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

export const RestrictedScope: StoryObj<typeof ScopeForm> = {
  render: () => (
    <ScopeForm
      isOpen
      onClose={() => {}}
      data={{
        ...scopes[2],
        targets: [
          {
            config: {
              name: "*",
              id: "8ba5e6cd-164e-4e38-a40c-dd6c7b1a9944",
              namespace: "staging",
              types: ["Kubernetes::Pod", "Kubernetes::Deployment"],
              labelSelector: "team=payments"
            }
          }
        ]
      }}
    />
  )
};

export const ConflictingTags: StoryObj<typeof ScopeForm> = {
  render: () => (
    <ScopeForm
      isOpen
      onClose={() => {}}
      data={{
        ...scopes[2],
        targets: [
          {
            config: {
              tagSelector:
                " env=prod , env=dev,app.kubernetes.io/name=web,empty="
            }
          }
        ]
      }}
    />
  )
};

export const ScopeFromKubernetes: StoryObj<typeof ScopeForm> = {
  render: () => <ScopeForm isOpen onClose={() => {}} data={scopes[4]} />
};
