import { ComponentStory } from "@storybook/react";
import { Loading } from "./index";

export default {
  title: "Loading",
  component: Loading
};

const Template: ComponentStory<typeof Loading> = (arg) => <Loading {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  text: "Loading..."
};
