import { ComponentStory } from "@storybook/react";
import { EditableText } from "./EditableText";

export default {
  title: "EditableText",
  component: EditableText
};

const Template: ComponentStory<typeof EditableText> = (arg) => (
  <EditableText {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  value: "editable text",
  placeholder: "placeholder"
};
