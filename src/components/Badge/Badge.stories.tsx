import { ComponentStory } from "@storybook/react";
import { Badge } from "./index";

export default {
  title: "Badge",
  component: Badge
};

const Template: ComponentStory<typeof Badge> = (arg) => <Badge {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  text: "This is text",
  title: "title",
  value: "56",
  dot: "#00ccff"
};
