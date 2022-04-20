import { useState } from "react";
import { SearchLayout } from "../../components/Layout";
import { TimeRangePicker } from "../../components/TimeRangePicker";

export const TimeRangePickerDemo = () => {
  const [value, setValue] = useState([new Date(), new Date()]);
  // const [value2, setValue2] = useState([new Date(), new Date()]);
  const onChange = (from, to) => {
    setValue([from, to]);
  };
  // const onChange2 = (from, to) => {
  //   setValue2([from, to]);
  // };

  return (
    <SearchLayout title="time-picker">
      <div className="flex justify-between">
        <TimeRangePicker onChange={onChange} from={value[0]} to={value[1]} />
        {/* <TimeRangePicker onChange={onChange2} from={value2[0]} to={value2[1]} /> */}
        <TimeRangePicker />
      </div>
    </SearchLayout>
  );
};
