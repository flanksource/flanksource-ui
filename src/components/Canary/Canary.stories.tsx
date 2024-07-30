import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Canary } from "./index";

export default {
  title: "Canary",
  component: Canary,
  argTypes: {},
  decorators: [(Story) => <Story />]
} as ComponentMeta<typeof Canary>;

const Template: ComponentStory<typeof Canary> = (arg) => <Canary {...arg} />;

export const Variant1 = Template.bind({});

Variant1.args = {
  url: "/api/canary/api"
};
