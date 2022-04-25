import { MultiSelectDropdown } from "./index";

export default {
  title: "MultiSelectDropdown",
  component: MultiSelectDropdown
};

const mockLabels = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "banana", label: "Banana" },
  { value: "grape", label: "Grape" },
  { value: "pear", label: "Pear" }
];

const Template = (arg) => <MultiSelectDropdown {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  options: mockLabels
};
