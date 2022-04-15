import { RefreshButton } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
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
