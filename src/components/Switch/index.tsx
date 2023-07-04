import clsx from "clsx";
import { useEffect, useState } from "react";

type Props<T extends string | number | boolean> = {
  value?: T;
  onChange?: (value: T) => void;
  options: T[];
  className?: string;
  itemsClassName?: string;
} & Omit<React.DetailsHTMLAttributes<HTMLDivElement>, "onChange">;

export function Switch<T extends string | number | boolean>({
  onChange = () => {},
  options,
  value,
  className,
  itemsClassName = "flex-1",
  ...props
}: Props<T>) {
  const [activeOption, setActiveOption] = useState(() => value ?? options[0]);
  const activeClasses =
    "p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium bg-white shadow-sm ring-1 ring-black ring-opacity-5";
  const inActiveClasses =
    "p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium";

  function handleClick(view: T) {
    onChange(view);
  }

  useEffect(() => {
    setActiveOption(value ?? options[0]);
  }, [options, value]);

  return (
    <div
      className={clsx(
        "flex flex-row group p-0.5 rounded-lg bg-gray-100 hover:bg-gray-200",
        className
      )}
      {...props}
    >
      {options.map((option) => {
        return (
          <button
            type="button"
            className={`${itemsClassName} rounded-md items-center text-sm text-gray-600 font-medium focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-offset-gray-100`}
            tabIndex={0}
            onClick={(e) => handleClick(option)}
            key={option.toString()}
          >
            <span
              className={
                activeOption === option ? activeClasses : inActiveClasses
              }
            >
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
