import { useState } from "react";
import { Modal } from "./index";

export default {
  title: "Modal",
  component: Modal
};

const Template = (arg) => {
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
      <Modal open={isOpen} onClose={handleClose} {...arg} />
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
