import { ComponentMeta, ComponentStory } from "@storybook/react";

import { TimeRangePicker } from "./index";

export default {
  title: "TimeRangePicker",
  component: TimeRangePicker
} as ComponentMeta<typeof TimeRangePicker>;

const Template: ComponentStory<typeof TimeRangePicker> = (args) => (
  <TimeRangePicker {...args} />
);

export const Primary = Template.bind({});

Primary.args = {};
