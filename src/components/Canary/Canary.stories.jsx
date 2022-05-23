import { Canary } from "./index";

export default {
  title: "Canary",
  component: Canary,
  argTypes: {}
};

const Template = (arg) => <Canary {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  url: "/canary/api",
  refreshInterval: 15 * 1000,
  topLayoutOffset: 0,
  hideSearch: false,
  hideTimeRange: false
};
