import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { useCallback } from "react";
import { rangeOptions } from "./rangeOptions";

export const TimeRangeList = ({
  closePicker,
  currentRange,
  changeRangeValue,
  setShowCalendar
}) => {
  const isChecked = useCallback((option, value) => {
    if (!option || !value) {
      return false;
    }

    return option.from === value.from && option.to === value.to;
  }, []);

  const setOption = useCallback(
    (option) => {
      const { from, to } = option;
      changeRangeValue({
        from,
        to
      });
      closePicker();
      setShowCalendar(false);
    },
    [changeRangeValue, closePicker, setShowCalendar]
  );

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
              { "bg-blue-100": isChecked(option, currentRange) }
            )}
          >
            <label htmlFor={id} className="cursor-pointer py-1.5 px-2">
              {option.display}
            </label>
            <input
              type="checkbox"
              className="opacity-0 cursor-pointer"
              checked={isChecked(option, currentRange)}
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
  currentRange: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  ),
  changeRangeValue: PropTypes.func,
  setShowCalendar: PropTypes.func
};

TimeRangeList.defaultProps = {
  closePicker: () => {},
  currentRange: {},
  changeRangeValue: () => {},
  setShowCalendar: () => {}
};
