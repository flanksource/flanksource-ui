import { RefreshButton } from "./index";

export default {
  title: "RefreshButton",
  component: RefreshButton,
  args: {
    // eslint-disable-next-line no-alert
    onClick: () => alert("hello!"),
    className: ""
  }
};

const Template = (arg) => <RefreshButton {...arg} />;

export const Variant1 = Template.bind({});
