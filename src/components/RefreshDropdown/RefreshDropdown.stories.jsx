import RefreshDropdown from "./index";

export default {
  title: "RefreshDropdown",
  component: RefreshDropdown,
  args: {
    // eslint-disable-next-line no-alert
    onClick: () => alert("hello!"),
    className: ""
  }
};

const Template = (arg) => <RefreshDropdown {...arg} />;

export const Variant1 = Template.bind({});
