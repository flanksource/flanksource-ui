import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import clsx from "clsx";
import { FiClock } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import { TimeRangePickerBody } from "./TimeRangePickerBody";

import { RangeOption } from "./rangeOptions";
import { createDisplayValue } from "./helpers";

import "./index.css";

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
      {/* justify-center w-full  */}
      <button
        type="button"
        className="inline-flex px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        onClick={() => setIsPickerOpen((prevState) => !prevState)}
      >
        <FiClock className="mt-1" />
        {updateDisplayValue && (
          <div className="items-center ml-2 font-medium">
            <span>{updateDisplayValue}</span>
          </div>
        )}
        {!updateDisplayValue && (
          <div className="items-center ml-2 font-medium">
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
