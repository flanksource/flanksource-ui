import { SearchLayout } from "../../components/Layout";
import { TimeRangePicker } from "../../components/TimeRangePicker/TimeRangePicker";

export const TimeRangePickerDemo = () => (
  <SearchLayout title="time-picker">
    <div className="flex justify-between">
      <TimeRangePicker />
      <TimeRangePicker />
    </div>
  </SearchLayout>
);
