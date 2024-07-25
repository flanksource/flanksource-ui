import { StoryObj } from "@storybook/react";
import { DropdownMenu } from "./index";

export default {
  title: "DropdownMenu",
  component: DropdownMenu
};

type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu
      buttonElement={
        <div
          className="flex w-full items-center justify-between border border-gray-300 px-2 py-2"
          style={{ height: "38px", borderRadius: "4px" }}
        >
          <span className="text-sm text-gray-500">Boolean labels</span>
        </div>
      }
      content={
        <div>
          <div>label1</div>
          <div>label2</div>
          <div>label3</div>
        </div>
      }
    />
  )
};
