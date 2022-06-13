import { Switch } from "./";

export default {
  title: "Switch",
  component: Switch
};

const Template = (arg) => <Switch style={{ width: "150px" }} {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  options: ["Code", "HTML"],
  value: "Code",
  onChange: () => {}
};
