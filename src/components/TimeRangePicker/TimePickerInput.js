import PropTypes from "prop-types";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import clsx from "clsx";
import "./index.css";

export const TimePickerInput = ({
  inputValue,
  setInputValue,
  setShowCalendar,
  error
}) => (
  <div className="input-range-box">
    <div className="flex">
      <div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={() => setShowCalendar(false)}
          className={clsx(
            "px-1 py-0.5 border border-gray-300 rounded-sm focus:border-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300",
            { "border-red-300": error }
          )}
        />
      </div>
      <div className="flex bg-gray-200 hover:bg-gray-300 ml-0.5 rounded-sm">
        <button
          type="button"
          onClick={() => setShowCalendar((prevState) => !prevState)}
          className="px-1 mx-1"
        >
          <FaRegCalendarAlt color="#303030" />
        </button>
      </div>
    </div>
    {error && (
      <div className="error-range-box relative flex items-center mt-1.5 bg-pink-200 text-xs font-medium rounded-sm pt-1 pb-1.5 px-2.5">
        <div className="mt-0.5 mr-1">
          <FiAlertTriangle />
        </div>
        <div>{error}</div>
      </div>
    )}
  </div>
);

TimePickerInput.propTypes = {
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
  error: PropTypes.string,
  setShowCalendar: PropTypes.func
};

TimePickerInput.defaultProps = {
  inputValue: "",
  setInputValue: () => {},
  error: null,
  setShowCalendar: () => {}
};
