import { ComponentMeta, ComponentStory } from "@storybook/react";

import { TextWithDivider } from "./TextWithDivider";

export default {
  title: "TextWithDivider",
  component: TextWithDivider
} as ComponentMeta<typeof TextWithDivider>;

const Template: ComponentStory<typeof TextWithDivider> = (args) => (
  <TextWithDivider {...args} />
);

export const Primary = Template.bind({});

Primary.args = { text: "Divider" };
