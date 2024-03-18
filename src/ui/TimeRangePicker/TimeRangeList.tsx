import clsx from "clsx";
import { TimeRangeOption, rangeOptionsCategories } from "./rangeOptions";

type TimeRangeListProps = {
  closePicker: () => void;
  currentRange?: TimeRangeOption;
  changeRangeValue: (val: TimeRangeOption) => void;
  setShowCalendar: (val: boolean) => void;
} & React.HTMLProps<HTMLDivElement>;

export function TimeRangeList({
  closePicker = () => {},
  currentRange,
  changeRangeValue = () => {},
  setShowCalendar = () => {},
  ...rest
}: TimeRangeListProps) {
  const isChecked = (option?: TimeRangeOption, value?: TimeRangeOption) => {
    return option?.display === value?.display;
  };

  const setOption = (option: TimeRangeOption) => {
    changeRangeValue(option);
    closePicker();
    setShowCalendar(false);
  };

  return (
    <div {...rest}>
      {rangeOptionsCategories.map((category, index) => {
        return (
          <div className="px-4 text-left" key={category.name}>
            <div className="text-gray-500 text-base sm:space-x-2 pl-1 my-1 whitespace-nowrap font-semibold">
              {category.name}
            </div>
            {category.options.map((option) => {
              return (
                <button
                  type="button"
                  onClick={() => setOption(option)}
                  key={option.display}
                  className={clsx(
                    "option-item hover:bg-gray-100 flex justify-between items-center text-left w-full",
                    { "bg-gray-100": isChecked(option, currentRange) }
                  )}
                >
                  <label
                    htmlFor={`checkbox-${option.display}`}
                    className="cursor-pointer py-1.5 px-2"
                  >
                    {option.display}
                  </label>
                  <input
                    type="checkbox"
                    className="opacity-0 cursor-pointer"
                    checked={isChecked(option, currentRange)}
                    onChange={() => {}}
                    name="range-checkbox"
                    id={`checkbox-${option.display}`}
                  />
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
