import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SearchSelect } from "./index";
import sampleConfigList from "../../data/sampleConfigList";

export default {
  title: "SearchSelect",
  component: SearchSelect,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof SearchSelect>;

const mockLabels = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "banana", label: "Banana" },
  { value: "grape", label: "Grape" },
  { value: "pear", label: "Pear" }
];

const Template: ComponentStory<typeof SearchSelect> = (arg: any) => (
  <SearchSelect {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  name: "Eat:",
  options: mockLabels
};

const configTagData = sampleConfigList.flatMap((d) =>
  Object.entries(d.tags ?? {})
);
const configTags = configTagData.map(([key, val]) => {
  const itemVal = `${key}__:__${val}`;
  return {
    value: itemVal,
    data: [key, val],
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

const TagTemplate: ComponentStory<typeof SearchSelect> = (args: any) => (
  <div className="w-80">
    <SearchSelect {...args} />
  </div>
);

export const WithTags = TagTemplate.bind({});
WithTags.args = {
  name: "Tag:",
  options: configTags
};
