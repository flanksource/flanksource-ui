import { memo } from "react";
import Calendar, { OnChangeDateCallback } from "react-calendar";
import { GrClose } from "react-icons/gr";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

type TimePickerCalendarProps = {
  calendarValue: Date | undefined;
  onChange: OnChangeDateCallback;
  setShowCalendar: (val: boolean) => void;
};

export const TimePickerCalendarFC = ({
  calendarValue,
  onChange = () => {},
  setShowCalendar = () => {}
}: TimePickerCalendarProps) => (
  <div className="p-2 bg-gray-50 rounded-sm border border-gray-300">
    <div className="flex justify-between align-center mb-2">
      <div className="font-medium">Select a time range</div>
      <div>
        <button
          type="button"
          onClick={() => setShowCalendar(false)}
          className="bg-gray-200 hover:bg-gray-300 rounded-sm px-1.5 py-1.5 transition duration-200 ease"
        >
          <GrClose size="12px" />
        </button>
      </div>
    </div>
    <div>
      <Calendar
        locale="en"
        next2Label={null}
        prev2Label={null}
        nextLabel={<FaAngleRight size="18px" className="text-dark-gray" />}
        prevLabel={<FaAngleLeft size="18px" className="text-dark-gray" />}
        className="react-calendar-custom w-full"
        tileClassName="react-calendar-custom__tile"
        value={calendarValue}
        onChange={onChange}
      />
    </div>
  </div>
);

export const TimePickerCalendar = memo(TimePickerCalendarFC);
