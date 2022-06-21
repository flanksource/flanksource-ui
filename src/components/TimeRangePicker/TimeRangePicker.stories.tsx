import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import { TimeRangePicker } from "./index";

const TimeRangePickerContainer = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const onChange = (...dates: any[]) => {
    setFrom(dates[0]);
    setTo(dates[1]);
  };
  return (
    <TimeRangePicker
      style={{ width: "450px" }}
      from={from}
      to={to}
      onChange={onChange}
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
