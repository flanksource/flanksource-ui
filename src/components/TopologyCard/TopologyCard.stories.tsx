import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { CardSize, TopologyCard } from "./index";

export default {
  title: "TopologyCard",
  component: TopologyCard,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    )
  ]
} as ComponentMeta<typeof TopologyCard>;

const topology = {
  name: "cluster",
  id: "0181ce1a-e62d-156c-f974-2a1c60f439bd",
  topology_type: "component",
  namespace: "default",
  labels: {
    canary: "kubernetes-cluster",
    "kustomize.toolkit.fluxcd.io/name": "canaries",
    "kustomize.toolkit.fluxcd.io/namespace": "default"
  },
  icon: "kubernetes",
  status: "unhealthy",
  type: "KubernetesCluster",
  summary: {
    healthy: 1,
    unhealthy: 1
  },
  components: [
    {
      name: "pods",
      id: "0181ce1a-e637-1be1-53e8-7f529d4a092c",
      topology_type: "component",
      icon: "pods",
      status: "unhealthy",
      path: "0181ce1a-e62d-156c-f974-2a1c60f439bd",
      type: "KubernetesPods",
      summary: {
        healthy: 128,
        unhealthy: 10
      },
      parent_id: "0181ce1a-e62d-156c-f974-2a1c60f439bd",
      system_template_id: "018122ef-c448-b755-aa8b-009b24868732",
      created_at: "2022-07-05T11:24:38.327108Z",
      updated_at: "2022-07-05T11:24:38.327108Z",
      deleted_at: null
    },
    {
      name: "nodes",
      id: "0181ce1a-e62f-d7b2-3a71-eff77224e620",
      topology_type: "component",
      icon: "server",
      status: "healthy",
      path: "0181ce1a-e62d-156c-f974-2a1c60f439bd",
      type: "KubernetesNode",
      summary: {
        healthy: 3
      },
      parent_id: "0181ce1a-e62d-156c-f974-2a1c60f439bd",
      system_template_id: "018122ef-c448-b755-aa8b-009b24868732",
      created_at: "2022-07-05T11:24:38.319422Z",
      updated_at: "2022-07-05T11:24:38.319422Z",
      deleted_at: null
    }
  ],
  system_template_id: "018122ef-c448-b755-aa8b-009b24868732",
  created_at: "2022-07-05T11:24:38.317099Z",
  updated_at: "2022-07-05T11:24:38.317099Z",
  deleted_at: null
};

const Template: ComponentStory<typeof TopologyCard> = (arg: any) => {
  return Object.keys(CardSize).map((size) => (
    <TopologyCard {...arg} size={size} />
  ));
};

export const Base = Template.bind({});
Base.args = {
  topology: topology
};
