import { Select } from "./index";
import sampleConfigList from "../../data/sampleConfigList";

export default {
  title: "Select",
  component: Select
};

const mockLabels = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "banana", label: "Banana" },
  { value: "grape", label: "Grape" },
  { value: "pear", label: "Pear" }
];

const Template = (arg) => <Select {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  name: "Test",
  options: mockLabels,
  isMulti: true,
  allowSelectAll: true,
  allOption: { value: mockLabels.map((x) => x.value), label: "All" }
};

let configTags = sampleConfigList.flatMap((d) => Object.entries(d.tags));
configTags = configTags.map(([key, val]) => {
  const itemVal = `${key}__:__${val}`;
  return {
    value: itemVal,
    label: (
      <div
        className="mr-1 rounded-md border border-gray-300 bg-gray-200 px-1 py-0.75 text-xs font-semibold text-gray-600"
        key={key}
      >
        {key}: <span className="font-light">{val}</span>
      </div>
    )
  };
});

const TagTemplate = (args) => (
  <div className="w-96">
    <Select {...args} />
  </div>
);

export const WithTags = TagTemplate.bind({});
WithTags.args = {
  name: "Tags",
  options: configTags,
  isMulti: true,
  allowSelectAll: true,
  allOption: { value: configTags.map((x) => x.value), label: "All" }
};
