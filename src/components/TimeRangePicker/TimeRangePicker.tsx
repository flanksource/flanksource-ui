import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const pickerRef = useRef<any>();
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

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!pickerRef?.current?.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  return (
    <div className="relative text-sm w-fit time-picker-main" ref={pickerRef}>
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        onClick={() => setIsPickerOpen((prevState) => !prevState)}
      >
        <FiClock className="items-center" />
        <div className="ml-2 font-medium items-center">
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
