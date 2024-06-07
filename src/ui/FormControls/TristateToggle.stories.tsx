import { ComponentStory } from "@storybook/react";
import { TristateToggle } from "./TristateToggle";

export default {
  title: "TristateToggle",
  component: TristateToggle
};

const Template: ComponentStory<typeof TristateToggle> = (arg) => (
  <TristateToggle {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  label: {},
  value: "value",
  onChange: () => {}
};
