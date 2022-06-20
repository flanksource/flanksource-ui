import PropTypes from "prop-types";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { FiClock } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import clsx from "clsx";
import dayjs from "dayjs";
import { TimeRangePickerBody } from "./TimeRangePickerBody";
import "./index.css";
import { areDatesSame, convertRangeValue, createDisplayValue } from "./helpers";
import { RangeOption } from "./rangeOptions";

type DateOrString = Date | string;

type TimeRangePickerType = {
  from: string;
  to: string;
  onChange: (...args: DateOrString[]) => void;
};

export const TimeRangePickerFC = ({
  onChange,
  from,
  to
}: TimeRangePickerType) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef =
    useRef<HTMLButtonElement>() as React.LegacyRef<HTMLButtonElement>;
  const [sentRange, setSentRange] = useState<{
    from: DateOrString;
    to: DateOrString;
  }>();
  const [memoRange, setMemoRange] = useState<RangeOption>();

  const currentRange = useMemo((): RangeOption => {
    if (
      sentRange &&
      areDatesSame(from, sentRange.from) &&
      areDatesSame(to, sentRange.to)
    ) {
      return memoRange as RangeOption;
    }
    return { from, to };
  }, [from, to]);

  const updateDisplayValue = useMemo(
    () => createDisplayValue(currentRange),
    [currentRange]
  );

  const changeRangeValue = useCallback(
    (range: RangeOption) => {
      const { from, to } = range;
      setMemoRange({ from, to });
      setSentRange({
        from: convertRangeValue(from, "jsDate"),
        to: convertRangeValue(to, "jsDate")
      });
      onChange(
        convertRangeValue(from, "jsDate"),
        convertRangeValue(to, "jsDate")
      );
    },
    [onChange]
  );

  return (
    <div className="relative text-sm w-fit time-picker-main">
      <button
        ref={pickerRef}
        type="button"
        className="time-range-picker-widget flex items-center justify-center px-2 py-1 bg-gray-50 cursor-pointer rounded-sm border border-gray-300 w-fit"
        onClick={() => setIsPickerOpen((prevState) => !prevState)}
      >
        <div>
          <FiClock />
        </div>
        <div className="ml-2 font-medium">
          Time range: <span>{updateDisplayValue}</span>
        </div>
        <div
          className={clsx("timepicker-arrow-indicator ml-2", {
            active: isPickerOpen
          })}
        >
          <MdOutlineKeyboardArrowDown />
        </div>
      </button>
      <TimeRangePickerBody
        pickerRef={pickerRef}
        isOpen={isPickerOpen}
        closePicker={() => setIsPickerOpen(false)}
        currentRange={currentRange}
        changeRangeValue={changeRangeValue}
      />
    </div>
  );
};

TimeRangePickerFC.propTypes = {
  onChange: PropTypes.func,
  from: PropTypes.shape({}),
  to: PropTypes.shape({})
};

TimeRangePickerFC.defaultProps = {
  onChange: (from: string, to: string) => {
    console.log("FROM: ", from, "\n", "TO: ", to);
  },
  from: dayjs(new Date()).subtract(1, "h").toDate(),
  to: new Date()
};

export const TimeRangePicker = memo(TimeRangePickerFC);
