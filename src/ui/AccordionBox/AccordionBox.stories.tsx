import { ComponentStory } from "@storybook/react";
import { AccordionBox } from "./index";

export default {
  title: "AccordionBox",
  component: AccordionBox
};

const Template: ComponentStory<typeof AccordionBox> = (arg) => (
  <AccordionBox {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  content: "Title",
  hiddenContent: "Hidden content"
};

export const Variant2 = Template.bind({});
Variant2.args = {
  content: "Title",
  hiddenContent:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
};
