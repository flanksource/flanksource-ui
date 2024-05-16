import { ComponentStory } from "@storybook/react";
import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
  argTypes: {
    size: {
      type: "string",
      description: "Button size",
      defaultValue: "sm",
      options: ["xs", "sm", "md", "lg", "xl"],
      control: {
        type: "select"
      }
    }
  }
};

const Template: ComponentStory<typeof Button> = (arg) => <Button {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  className: "btn-primary",
  text: "this is button",
  icon: "alert",
  size: "sm",
  onClick: () => {
    // eslint-disable-next-line no-alert
    alert("hello");
  }
};
