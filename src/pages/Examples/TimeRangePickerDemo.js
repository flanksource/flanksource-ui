import { useState } from "react";
import { SearchLayout } from "../../components/Layout";
import { TimeRangePicker } from "../../components/TimeRangePicker/TimeRangePicker";

export const TimeRangePickerDemo = () => {
  const [value, setValue] = useState([new Date(), new Date()]);
  const onChange = (from, to) => {
    setValue([from, to]);
  };

  return (
    <SearchLayout title="time-picker">
      <div className="flex justify-between">
        <TimeRangePicker onChange={onChange} from={value[0]} to={value[1]} />
        <TimeRangePicker />
      </div>
    </SearchLayout>
  );
};
