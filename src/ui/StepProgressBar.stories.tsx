import { ComponentStory } from "@storybook/react";
import { StepProgressBar, StepProgressBarProps } from "./StepProgressBar";

export default {
  title: "StepProgressBar",
  component: StepProgressBar
};

const Template: ComponentStory<typeof StepProgressBar> = (
  args: StepProgressBarProps
) => <StepProgressBar {...args} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  steps: [
    {
      label: "Responder Type",
      position: 1,
      inProgress: true,
      finished: false
    },
    {
      label: "Details",
      position: 2,
      inProgress: false,
      finished: false
    },
    {
      label: "Preview",
      position: 3,
      inProgress: false,
      finished: false
    }
  ]
};
