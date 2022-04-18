import { Button } from "./index";

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

const Template = (arg) => <Button {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  className: "btn-primary",
  text: "this is button",
  icon: "alert",
  size: "sm",
  onClick: () => {
    alert("hello");
  }
};
