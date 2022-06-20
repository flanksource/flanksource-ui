import PropTypes from "prop-types";
import Calendar from "react-calendar";
import "./index.css";
import { GrClose } from "react-icons/gr";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export const TimePickerCalendar = ({
  calendarValue,
  onChangeCalendarRange,
  setShowCalendar
}) => (
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
        selectRange
        next2Label={null}
        prev2Label={null}
        nextLabel={<FaAngleRight size="18px" color="#272727" />}
        prevLabel={<FaAngleLeft size="18px" color="#272727" />}
        className="react-calendar-custom"
        tileClassName="react-calendar-custom__tile"
        value={calendarValue}
        onChange={onChangeCalendarRange}
      />
    </div>
  </div>
);

TimePickerCalendar.propTypes = {
  calendarValue: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  onChangeCalendarRange: PropTypes.func,
  setShowCalendar: PropTypes.func
};

TimePickerCalendar.defaultProps = {
  calendarValue: null,
  onChangeCalendarRange: () => {},
  setShowCalendar: () => {}
};
