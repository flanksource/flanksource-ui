import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { TimeRangePicker } from "./index";
import { TimeRangeOption } from "./rangeOptions";

const TimeRangePickerContainer = () => {
  const [value, setValue] = useState<TimeRangeOption | undefined>();

  const onChange = (range: TimeRangeOption) => {
    console.log("range", range);
    setValue(range);
  };
  return (
    <TimeRangePicker
      style={{ width: "450px" }}
      onChange={onChange}
      value={value}
    />
  );
};

export default {
  title: "TimeRangePicker",
  component: TimeRangePicker
} as ComponentMeta<typeof TimeRangePicker>;

const Template: ComponentStory<typeof TimeRangePicker> = () => (
  <TimeRangePickerContainer />
);

export const Primary = Template.bind({});

Primary.args = {};
