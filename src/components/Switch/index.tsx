import clsx from "clsx";
import { useEffect, useState } from "react";

type Props = {
  value?: string | number | boolean;
  onChange?: (value: string | number | boolean) => void;
  options: (number | string | boolean)[];
  className?: string;
} & Omit<React.DetailsHTMLAttributes<HTMLDivElement>, "onChange">;

export function Switch({
  onChange = () => {},
  options,
  value,
  className,
  ...props
}: Props) {
  const [activeOption, setActiveOption] = useState(() => value ?? options[0]);
  const activeClasses =
    "p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium bg-white shadow-sm ring-1 ring-black ring-opacity-5";
  const inActiveClasses =
    "p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium";

  function handleClick(view: string | number | boolean) {
    onChange(view);
  }

  useEffect(() => {
    setActiveOption(value ?? options[0]);
  }, [value]);

  return (
    <div
      className={clsx(
        "flex flex-row group p-0.5 rounded-lg flex bg-gray-100 hover:bg-gray-200",
        className
      )}
      {...props}
    >
      {options.map((option) => {
        return (
          <button
            type="button"
            className="flex-1 rounded-md items-center text-sm text-gray-600 font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-offset-gray-100"
            tabIndex={0}
            onClick={(e) => handleClick(option)}
            key={option.valueOf().toString()}
          >
            <span
              className={
                activeOption.valueOf().toString() ===
                option.valueOf().toString()
                  ? activeClasses
                  : inActiveClasses
              }
            >
              {option.valueOf().toString()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
