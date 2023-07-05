import { ComponentStory } from "@storybook/react";
import { Status } from "./index";

export default {
  title: "Status",
  component: Status
};

const Template: ComponentStory<typeof Status> = (arg) => <Status {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  good: true,
  mixed: true
};
