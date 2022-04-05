import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import dayjs from "dayjs";
import { rangeOptions } from "./rangeOptions";
import { getIntervalData } from "./helpers";

export const TimeRangeList = ({
  closePicker,
  rangeDisplayValue,
  setRangeDisplayValue,
  setRangeValue,
  setInputValue,
  setCalendarValue,
  setShowCalendar
}) => {
  const isChecked = (option, value) => {
    if (!option || !value) {
      return false;
    }

    return option.from === value.from && option.to === value.to;
  };

  const setOption = (option) => {
    const { from, to } = option;
    setRangeDisplayValue({
      from,
      to,
      display: option.display
    });
    setInputValue((prevState) => ({ ...prevState, from, to }));
    setRangeValue({
      from: dayjs()
        .subtract(...getIntervalData(option.from))
        .format(),
      to: dayjs().format()
    });
    closePicker();
    setShowCalendar(false);
    setCalendarValue(null);
  };

  return (
    <div>
      {rangeOptions.map((option) => {
        const id = uuidv4();
        return (
          <button
            type="button"
            onClick={() => setOption(option)}
            key={option.display}
            className={clsx(
              "option-item hover:bg-blue-200 flex justify-between items-center w-full",
              { active: isChecked(option, rangeDisplayValue) }
            )}
          >
            <label htmlFor={id} className="cursor-pointer py-1.5 px-2">
              {option.display}
            </label>
            <input
              type="checkbox"
              className="opacity-0 cursor-pointer"
              checked={isChecked(option, rangeDisplayValue)}
              onChange={() => {}}
              name="range-checkbox"
              id={id}
            />
          </button>
        );
      })}
    </div>
  );
};

TimeRangeList.propTypes = {
  closePicker: PropTypes.func,
  rangeDisplayValue: PropTypes.shape({}),
  setRangeDisplayValue: PropTypes.func,
  setRangeValue: PropTypes.func,
  setInputValue: PropTypes.func,
  setCalendarValue: PropTypes.func,
  setShowCalendar: PropTypes.func
};

TimeRangeList.defaultProps = {
  closePicker: () => {},
  rangeDisplayValue: {},
  setRangeDisplayValue: () => {},
  setRangeValue: () => {},
  setInputValue: () => {},
  setCalendarValue: () => {},
  setShowCalendar: () => {}
};
