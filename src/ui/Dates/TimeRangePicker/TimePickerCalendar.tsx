import Calendar, { OnChangeDateCallback } from "react-calendar";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { GrClose } from "react-icons/gr";

type TimePickerCalendarProps = {
  calendarValue: Date | undefined;
  onChange: OnChangeDateCallback;
  setShowCalendar: (val: boolean) => void;
};

export function TimePickerCalendar({
  calendarValue,
  onChange = () => {},
  setShowCalendar = () => {}
}: TimePickerCalendarProps) {
  return (
    <div className="rounded-sm border border-gray-300 bg-gray-50 p-2">
      <div className="align-center mb-2 flex justify-between">
        <div className="font-medium">Select a time range</div>
        <div>
          <button
            type="button"
            onClick={() => setShowCalendar(false)}
            className="ease rounded-sm bg-gray-200 px-1.5 py-1.5 transition duration-200 hover:bg-gray-300"
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
}
