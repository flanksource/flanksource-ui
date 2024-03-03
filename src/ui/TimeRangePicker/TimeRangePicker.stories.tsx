import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { TimeRangePicker } from "./index";
import { TimeRangeOption } from "./rangeOptions";

const TimeRangePickerContainer = () => {
  const onChange = (range: TimeRangeOption) => {
    console.log("range", range);
  };
  return <TimeRangePicker style={{ width: "450px" }} onChange={onChange} />;
};

export default {
  title: "TimeRangePicker",
  component: TimeRangePicker
} as ComponentMeta<typeof TimeRangePicker>;

const Template: ComponentStory<typeof TimeRangePicker> = () => (
  <MemoryRouter>
    <TimeRangePickerContainer />
  </MemoryRouter>
);

export const Primary = Template.bind({});

Primary.args = {};
