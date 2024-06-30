import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IconPicker } from "./IconPicker";

export default {
  title: "Icons/IconPicker",
  component: IconPicker,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof IconPicker>;

const Template: ComponentStory<typeof IconPicker> = (arg: any) => (
  <IconPicker {...arg} />
);

export const Base = Template.bind({});

Base.args = {};
