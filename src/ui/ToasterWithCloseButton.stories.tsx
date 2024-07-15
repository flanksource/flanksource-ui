import { Meta, StoryFn } from "@storybook/react";
import toast from "react-hot-toast";
import { ToasterWithCloseButton } from "./ToasterWithCloseButton";

export default {
  title: "ToasterWithCloseButton",
  component: ToasterWithCloseButton
} satisfies Meta<typeof ToasterWithCloseButton>;

const Template: StoryFn<typeof ToasterWithCloseButton> = () => {
  return (
    <>
      <ToasterWithCloseButton />
      <div className="flex flex-col gap-4">
        <button
          className="btn-primary"
          onClick={() => {
            toast.error("This is an error message");
          }}
        >
          Show error toast
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            toast.success("This is a success message");
          }}
        >
          Show success toast
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            toast.loading("This is a loading message");
          }}
        >
          Show loading toast
        </button>
      </div>
    </>
  );
};

export const Examples = Template.bind({});
