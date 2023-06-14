import { Story } from "@storybook/react";
import React, { ComponentProps } from "react";
import AWSConfigsFormEditor from "./Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "./Configs/KubernetesConfigsFormEditor";
import SpecEditorForm from "./SpecEditorForm";
import { HTTPHealthFormEditor } from "./Health/HTTPHealthFormEditor";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { schemaResourceTypes } from "../SchemaResourcePage/resourceTypes";

const defaultQueryClient = new QueryClient();

export default {
  title: "SpecEditorForm",
  component: SpecEditorForm,
  decorators: [
    (Story: React.FC) => (
      <MemoryRouter>
        <QueryClientProvider client={defaultQueryClient}>
          <div className="w-screen h-screen overflow-y-auto p-4">
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
  configForm: KubernetesConfigsFormEditor,
  resourceInfo: schemaResourceTypes[2]
};

export const AWSSpecEditorFormConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

AWSSpecEditorFormConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  configForm: AWSConfigsFormEditor,
  resourceInfo: schemaResourceTypes[2]
};

export const HTTPHealthFormEditorConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

HTTPHealthFormEditorConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  configForm: HTTPHealthFormEditor,
  specFormFieldName: "spec.httpHealthCheck",
  resourceInfo: schemaResourceTypes.at(-1)
};
