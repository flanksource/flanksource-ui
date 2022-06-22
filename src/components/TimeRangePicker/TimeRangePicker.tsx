import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiClock } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import clsx from "clsx";
import { TimeRangePickerBody } from "./TimeRangePickerBody";
import "./index.css";
import { createDisplayValue } from "./helpers";
import { RangeOption } from "./rangeOptions";

type DateOrString = Date | string;

type TimeRangePickerType = React.HTMLProps<HTMLDivElement> & {
  from: string;
  to: string;
  onChange: (...args: DateOrString[]) => void;
};

export const TimeRangePickerFC = ({
  onChange = () => {},
  from,
  to,
  className,
  ...rest
}: TimeRangePickerType) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<any>();

  const currentRange = useMemo((): RangeOption => {
    return { from, to };
  }, [from, to, isPickerOpen]);

  const updateDisplayValue = useMemo(
    () => createDisplayValue(currentRange),
    [currentRange]
  );

  const changeRangeValue = useCallback(
    (range: RangeOption) => {
      const { from, to } = range;
      onChange(from, to);
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
    <div
      className={clsx("relative text-sm w-fit", className)}
      ref={pickerRef}
      {...rest}
    >
      <button
        type="button"
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        onClick={() => setIsPickerOpen((prevState) => !prevState)}
      >
        <FiClock className="mt-1" />
        {updateDisplayValue && (
          <div className="ml-2 font-medium items-center">
            Time range: <span>{updateDisplayValue}</span>
          </div>
        )}
        {!updateDisplayValue && (
          <div className="ml-2 font-medium items-center">
            Please select time range
          </div>
        )}
        <div
          className={clsx("ml-2 mt-1", {
            "rotate-180": isPickerOpen
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

export const TimeRangePicker = memo(TimeRangePickerFC);
