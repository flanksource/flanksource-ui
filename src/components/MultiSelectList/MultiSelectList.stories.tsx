import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import MultiSelectList from "./MultiSelectList";

export default {
  title: "MultiSelectList",
  component: MultiSelectList
} as ComponentMeta<typeof MultiSelectList>;

const Template: ComponentStory<typeof MultiSelectList> = (args) => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const onOptionSelect = (option: any) => {
    if (selectedOptions.includes(option)) {
      const index = selectedOptions.indexOf(option);
      selectedOptions.splice(index, 1);
    } else {
      selectedOptions.push(option);
    }
    setSelectedOptions([...selectedOptions]);
  };
  return (
    <MultiSelectList
      {...args}
      onOptionSelect={onOptionSelect}
      selectedOptions={selectedOptions}
    />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  options: [1, 2, 3, 4, 5],
  renderOption: (option, index) => {
    return <div key={index}>{"Option " + index}</div>;
  }
};
