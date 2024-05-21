import { ComponentStory } from "@storybook/react";
import { TextInput } from "./TextInput";

export default {
  title: "TextInput",
  component: TextInput
};

const Template: ComponentStory<typeof TextInput> = (arg) => (
  <TextInput {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  id: "email1",
  label: "Email",
  type: "email"
};
