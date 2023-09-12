import { ComponentStory } from "@storybook/react";
import { DescriptionCard } from "./index";

export default {
  title: "DescriptionCard",
  component: DescriptionCard
};

const Template: ComponentStory<typeof DescriptionCard> = (arg) => (
  <DescriptionCard {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  title: "title",
  items: [
    { label: "name1", value: 22 },
    { label: "name2", value: 24 },
    { label: "name3", value: 232 }
  ]
};
