import { ComponentStory } from "@storybook/react";
import { TextInputClearable } from "./TextInputClearable";

export default {
  title: "TextInputClearable",
  component: TextInputClearable
};

const Template: ComponentStory<typeof TextInputClearable> = (arg) => (
  <TextInputClearable {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  hideClearButton: true,
  className: "w-80",
  placeholder: "Search for configs"
  // defaultValue: ""
};
