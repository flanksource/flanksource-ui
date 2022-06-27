import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import { TimeRangePicker } from "./index";

const TimeRangePickerContainerForInitialVersion = () => {
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

const TimeRangePickerContainerForAbsoluteVersion = () => {
  const [from, setFrom] = useState(new Date().toISOString());
  const [to, setTo] = useState(new Date().toISOString());
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

const TimeRangePickerContainerForRangeVersion = () => {
  const [from, setFrom] = useState("now-3h");
  const [to, setTo] = useState("now");
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
  <TimeRangePickerContainerForInitialVersion />
);

export const Primary = Template.bind({});

Primary.args = {};

const AbsoluteRangeTemplate: ComponentStory<typeof TimeRangePicker> = () => (
  <TimeRangePickerContainerForAbsoluteVersion />
);

export const AbsoluteRange = AbsoluteRangeTemplate.bind({});

AbsoluteRange.args = {};

const RelativeRangeTemplate: ComponentStory<typeof TimeRangePicker> = () => (
  <TimeRangePickerContainerForRangeVersion />
);

export const RelativeRange = RelativeRangeTemplate.bind({});

RelativeRange.args = {};
