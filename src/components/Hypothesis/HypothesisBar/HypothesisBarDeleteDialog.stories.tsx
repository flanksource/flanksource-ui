import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { HypothesisBarDeleteDialog } from "./HypothesisBarDeleteDialog";

export default {
  title: "HypothesisBar/DeleteDialog",
  component: HypothesisBarDeleteDialog,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof HypothesisBarDeleteDialog>;

const Template: ComponentStory<typeof HypothesisBarDeleteDialog> = (
  arg: any
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <HypothesisBarDeleteDialog
      {...arg}
      onOpen={onOpen}
      onClose={onClose}
      isOpen={isOpen}
    />
  );
};

export const Base = Template.bind({});
Base.args = {};
