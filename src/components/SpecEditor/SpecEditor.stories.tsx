import { Story } from "@storybook/react";
import { ComponentProps } from "react";
import AWSConfigsFormEditor from "../Forms/Configs/AWSConfigsFormEditor";
import KubernetesConfigsFormEditor from "../Forms/Configs/KubernetesConfigsFormEditor";
import SpecEditor, { SpecType } from "./SpecEditor";

const specTypes: SpecType[] = [
  {
    type: "form",
    name: "kubernetes",
    updateSpec: (value: Record<string, any>) => {
      console.log(value);
    },
    loadSpec: () => ({}),
    icon: "kubernetes",
    configForm: KubernetesConfigsFormEditor,
    specsMapField: "kubernetes.0",
    schemaFileName: "config_kubernetes.schema.json"
  },
  {
    type: "form",
    name: "aws",
    updateSpec: (value: Record<string, any>) => {
      console.log(value);
    },
    loadSpec: () => ({}),
    configForm: AWSConfigsFormEditor,
    icon: "aws",
    specsMapField: "aws.0",
    schemaFileName: "config_aws.schema.json"
  }
];

export default {
  title: "SpecEditor",
  component: SpecEditor,
  decorators: [
    (Story: React.FC) => (
      <div className="h-screen w-screen overflow-y-auto p-4">
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
