import { DropdownMenu } from "./index";

export default {
  title: "DropdownMenu",
  component: DropdownMenu
};

const Template = (arg) => <DropdownMenu {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  buttonElement: (
    <div
      className="border border-gray-300 w-full flex items-center justify-between px-2 py-2"
      style={{ height: "38px", borderRadius: "4px" }}
    >
      <span className="text-sm text-gray-500">Boolean labels</span>
    </div>
  ),
  content: (
    <div>
      <div>label1</div>
      <div>label2</div>
      <div>label3</div>
    </div>
  )
};
