import { ComponentStory } from "@storybook/react";
import { Chip } from "./chip";

export default {
  title: "Chip",
  component: Chip
};

const Template: ComponentStory<typeof Chip> = (arg) => <Chip {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  text: "text",
  color: "orange"
};
