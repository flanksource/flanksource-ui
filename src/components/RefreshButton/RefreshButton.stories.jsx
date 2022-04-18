import { RefreshButton } from "./index";

export default {
  title: "RefreshButton",
  component: RefreshButton,
  args: {
    onClick: () => alert("hillo!"),
    className: ""
  }
};

const Template = (arg) => <RefreshButton {...arg} />;

export const Variant1 = Template.bind({});
