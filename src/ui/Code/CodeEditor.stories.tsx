import { Meta, StoryFn } from "@storybook/react";
import { CodeEditor } from "./CodeEditor";

export default {
  title: "CodeEditor ",
  component: CodeEditor,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as Meta<typeof CodeEditor>;

const Template: StoryFn<typeof CodeEditor> = (arg: any) => (
  <CodeEditor {...arg} />
);

export const Base = Template.bind({});
Base.args = {};
