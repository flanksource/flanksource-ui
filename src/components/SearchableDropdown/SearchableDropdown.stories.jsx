import { SearchableDropdown } from "./index";

export default {
  title: "SearchableDropdown",
  component: SearchableDropdown
};

const options = [
  {
    label: "Group",
    options: [
      { value: "chocolate", label: "Chocolate" },
      { value: "strawberry", label: "Strawberry" },
      { value: "vanilla", label: "Vanilla" },
      { value: "banana", label: "Banana" },
      { value: "grape", label: "Grape" },
      { value: "pear", label: "Pear" }
    ]
  }
];

const Template = (arg) => <SearchableDropdown {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  options
};
