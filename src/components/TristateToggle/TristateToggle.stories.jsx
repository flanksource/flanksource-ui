import { TristateToggle } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "TristateToggle",
  component: TristateToggle
};

const Template = (arg) => <TristateToggle {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  label: "TristateToggle",
  value: "value",
  onChange: () => {}
};
