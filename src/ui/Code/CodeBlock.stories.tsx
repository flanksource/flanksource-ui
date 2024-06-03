import { Meta, StoryFn } from "@storybook/react";
import CodeBlock from "./CodeBlock";

export default {
  title: "CodeBlock",
  component: CodeBlock,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as Meta<typeof CodeBlock>;

const Template: StoryFn<typeof CodeBlock> = (arg: any) => (
  <CodeBlock {...arg} />
);

export const Base = Template.bind({});
Base.args = {};
