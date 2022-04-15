import { EditableText } from "./index";

// export default required by storybook
// eslint-disable-next-line import/no-default-export
export default {
  title: "EditableText",
  component: EditableText
};

const Template = (arg) => <EditableText {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  value: "editable text",
  placeholder: "placeholder"
};
