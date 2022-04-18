import { Chip } from "./index";

export default {
  title: "Chip",
  component: Chip
};

const Template = (arg) => <Chip {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  text: "text",
  color: "orange"
};
