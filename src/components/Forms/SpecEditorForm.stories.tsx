import { Story } from "@storybook/react";
import React, { ComponentProps } from "react";
import AWSConfigsFormEditor from "./Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "./Configs/KubernetesConfigsFormEditor";
import SpecEditorForm from "./SpecEditorForm";
import { HTTPHealthFormEditor } from "./Health/HTTPHealthFormEditor";

export default {
  title: "SpecEditorForm",
  component: SpecEditorForm,
  decorators: [
    (Story: React.FC) => (
      <div className="w-screen h-screen overflow-y-auto p-4">
        <Story />
      </div>
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
  configForm: KubernetesConfigsFormEditor
};

export const AWSSpecEditorFormConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

AWSSpecEditorFormConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  configForm: AWSConfigsFormEditor
};

export const HTTPHealthFormEditorConfigs: Story<
  ComponentProps<typeof SpecEditorForm>
> = Template.bind({});

HTTPHealthFormEditorConfigs.args = {
  updateSpec(spec) {
    console.log(spec);
  },
  configForm: HTTPHealthFormEditor,
  specFormFieldName: "spec.httpHealthCheck"
};
