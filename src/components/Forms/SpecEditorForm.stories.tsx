import { Story } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { schemaResourceTypes } from "../SchemaResourcePage/resourceTypes";
import AWSConfigsFormEditor from "./Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "./Configs/KubernetesConfigsFormEditor";
import { HTTPHealthFormEditor } from "./Health/HTTPHealthFormEditor";
import SpecEditorForm from "./SpecEditorForm";

const defaultQueryClient = new QueryClient();

export default {
  title: "SpecEditorForm",
  component: SpecEditorForm,
  decorators: [
    (Story: React.FC) => (
      <MemoryRouter>
        <QueryClientProvider client={defaultQueryClient}>
          <div className="h-screen w-screen overflow-y-auto p-4">
            <Story />
          </div>
        </QueryClientProvider>
      </MemoryRouter>
    )
  ]
};

const Template = (args: ComponentProps<typeof SpecEditorForm>) => (
  <SpecEditorForm {...args} />
);

export const KubernetesSpecEditorFormConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

KubernetesSpecEditorFormConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  selectedSpec: {
    configForm: KubernetesConfigsFormEditor,
    icon: "kubernetes",
    label: "Kubernetes",
    loadSpec: () => {
      return {};
    },
    type: "form",
    name: "kubernetes",
    schemaFileName: undefined,
    specsMapField: "kubernetes.0",
    updateSpec: () => {}
  },
  resourceInfo: schemaResourceTypes[2]
};

export const AWSSpecEditorFormConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

AWSSpecEditorFormConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  selectedSpec: {
    configForm: AWSConfigsFormEditor,
    icon: "kubernetes",
    label: "Kubernetes",
    loadSpec: () => {
      return {};
    },
    type: "form",
    name: "kubernetes",
    schemaFileName: undefined,
    specsMapField: "kubernetes.0",
    updateSpec: () => {}
  },
  resourceInfo: schemaResourceTypes[2]
};

export const HTTPHealthFormEditorConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

HTTPHealthFormEditorConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  selectedSpec: {
    configForm: HTTPHealthFormEditor,
    icon: "kubernetes",
    label: "Kubernetes",
    loadSpec: () => {
      return {};
    },
    type: "form",
    name: "kubernetes",
    schemaFileName: undefined,
    specsMapField: "kubernetes.0",
    updateSpec: () => {}
  },
  resourceInfo: schemaResourceTypes.at(-1)
};
