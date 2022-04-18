import { toastError } from "./toast";

export default {
  title: "Toast",
  component: toastError
};

const Template = (arg) => <toastError {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  message: "Toast messsage"
};
