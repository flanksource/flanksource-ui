import { Meta, StoryFn } from "@storybook/react";
import StepperList from "./StepperList";

export default {
  title: "ui/StepperList",
  component: StepperList
} satisfies Meta<typeof StepperList>;

const Template: StoryFn<typeof StepperList> = (args) => (
  <StepperList {...args} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  items: [
    <div key="step-1">Some list item</div>,
    <div className="flex flex-col gap-1" key="step-2">
      Some list item
    </div>,
    <div key="key-2">Some other list item</div>
  ]
};
