import { ComponentMeta, ComponentStory } from "@storybook/react";
import { QueryBuilder } from "./index";

export default {
  title: "QueryBuilder",
  component: QueryBuilder,
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof QueryBuilder>;

const Template: ComponentStory<typeof QueryBuilder> = (arg) => (
  <QueryBuilder {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {};
