import { Notification } from "./index";

export default {
  title: "Notification",
  component: Notification
};

const Template = (arg) => <Notification {...arg} />;

export const Variant1 = Template.bind({});
