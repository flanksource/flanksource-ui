import { Notification } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "Notification",
  component: Notification
};

const Template = (arg) => <Notification {...arg} />;

export const Variant1 = Template.bind({});
