import { ComponentStory } from "@storybook/react";
import { CustomScroll, CustomScrollProps } from "./index";

export default {
  title: "CustomScroll",
  component: CustomScroll
};

const Template: ComponentStory<typeof CustomScroll> = (
  args: CustomScrollProps
) => <CustomScroll {...args} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  children: new Array(50).fill(0).map((_, i) => {
    return <div key={i}>option list item {i + 1}</div>;
  }),
  minChildCount: 4,
  maxHeight: "150px",
  style: {
    width: "180px"
  }
};
