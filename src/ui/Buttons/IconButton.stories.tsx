import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BsTrash } from "react-icons/bs";
import { IconButton } from "./IconButton";

export default {
  title: "Icons/IconButton",
  component: IconButton,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (arg: any) => (
  <IconButton {...arg} />
);

export const Base = Template.bind({});
Base.args = {
  className: "w-4",
  icon: (
    <BsTrash
      className="text-gray-600 border-0 border-l-1 border-gray-200"
      size={18}
    />
  ),
  ovalProps: {
    height: "18px",
    width: "18px",
    fill: "transparent"
  },
  onClick: () => new Promise((resolve) => setTimeout(() => resolve(), 3000))
};
