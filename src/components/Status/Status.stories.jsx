import { Status } from "./index";

export default {
  title: "Status",
  component: Status
};

const Template = (arg) => <Status {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  good: true,
  mixed: true
};
