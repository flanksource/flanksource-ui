import { Loading } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "Loading",
  component: Loading
};

const Template = (arg) => <Loading {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  text: "Loading..."
};
