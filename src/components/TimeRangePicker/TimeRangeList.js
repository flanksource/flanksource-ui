/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import dayjs from "dayjs";
import { rangeOptions } from "./rangeOptions";
import { getFromValues } from "./helpers";

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
    const { from } = option;
    const { to } = option;
    setRangeDisplayValue({
      from,
      to,
      display: option.display
    });
    setInputValue((prevState) => ({ ...prevState, from, to }));
    setRangeValue({
      from: dayjs()
        .subtract(...getFromValues(option.from))
        .format(),
      to: dayjs().format()
    });
    closePicker();
    setShowCalendar(false);
    setCalendarValue(null);
  };

  return (
    <ul>
      {rangeOptions.map((option) => {
        const id = uuidv4();
        return (
          <li
            onClick={() => setOption(option)}
            key={id}
            className={clsx(
              "option-item py-1 px-2 hover:bg-blue-200 flex justify-between items-center",
              { active: isChecked(option, rangeDisplayValue) }
            )}
          >
            <label htmlFor={id} className="cursor-pointer w-full">
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
          </li>
        );
      })}
    </ul>
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
