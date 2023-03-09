import { Story } from "@storybook/react";
import { ComponentProps } from "react";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";
import SpecEditor, { SpecType } from "./SpecEditor";

const specTypes: SpecType[] = [
  {
    name: "kubernetes",
    description: "Edit kubernetes configs",
    updateSpec: (value: Record<string, any>) => {
      console.log(value);
    },
    loadSpec: () => ({}),
    icon: "kubernetes",
    configForm: KubernetesConfigsFormEditor,
    formFieldName: "spec.kubernetes.0"
  },
  {
    name: "aws",
    description: "Edit aws configs",
    updateSpec: (value: Record<string, any>) => {
      console.log(value);
    },
    loadSpec: () => ({}),
    configForm: AWSConfigsFormEditor,
    icon: "aws",
    formFieldName: "spec.aws.0"
  }
];

export default {
  title: "SpecEditor",
  component: SpecEditor,
  decorators: [
    (Story: React.FC) => (
      <div className="w-screen h-screen overflow-y-auto p-4">
        <Story />
      </div>
    )
  ]
};

const Template = (args: ComponentProps<typeof SpecEditor>) => (
  <SpecEditor {...args} />
);

export const DefaultSpecEditor: Story<ComponentProps<typeof SpecEditor>> =
  Template.bind({});

DefaultSpecEditor.args = {
  types: specTypes,
  format: "yaml"
};
