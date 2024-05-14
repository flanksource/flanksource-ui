import { ComponentMeta, ComponentStory } from "@storybook/react";
import { HypothesisDeleteDialog } from "./index";

export default {
  title: "HypothesisBar/HypothesisDeleteDialog",
  component: HypothesisDeleteDialog,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof HypothesisDeleteDialog>;

const Template: ComponentStory<typeof HypothesisDeleteDialog> = (arg: any) => (
  <HypothesisDeleteDialog {...arg} />
);

export const Base = Template.bind({});

Base.args = {
  isOpen: true
};
