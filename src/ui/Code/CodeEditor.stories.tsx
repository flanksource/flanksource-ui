import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CodeEditor } from "./CodeEditor";

export default {
  title: "CodeEditor ",
  component: CodeEditor,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof CodeEditor>;

const Template: ComponentStory<typeof CodeEditor> = (arg: any) => (
  <CodeEditor {...arg} />
);

export const Base = Template.bind({});
Base.args = {};
