import { Description } from "./description";

export default {
  title: "Description",
  component: Description
};

const Template = (arg) => <Description {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  label: "text",
  value: "value"
};
