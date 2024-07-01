import React, { useState } from "react";
import { Modal } from "./index";
import { ComponentStory } from "@storybook/react";

export default {
  title: "Modal",
  component: Modal
};

const Template: ComponentStory<React.FC> = (arg) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  return (
    <>
      <button
        className="btn-primary"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        show modal
      </button>
      <Modal open={isOpen} onClose={handleClose} {...arg}>
        children
      </Modal>
    </>
  );
};

export const Variant1 = Template.bind({});
Variant1.args = {
  title: "Modal title",
  children: (
    <div>
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child
    </div>
  )
};

export const Small = Template.bind({});
Small.args = {
  title: "Modal small title",
  size: "small",
  children: (
    <div>
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child
    </div>
  )
};

export const Large = Template.bind({});
Large.args = {
  title: "Modal large",
  size: "large",
  children: (
    <div>
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child
    </div>
  )
};


export const Full = Template.bind({});
Full.args = {
  title: "Modal fulle",
  size: "full",
  children: (
    <div>
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child Weird child Weird child
      Weird child Weird child Weird child Weird child
    </div>
  )
};
