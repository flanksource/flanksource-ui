import { toastError } from "./toast";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "Toast",
  component: toastError
};

const Template = (arg) => <toastError {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  message: "Toast messsage"
};
