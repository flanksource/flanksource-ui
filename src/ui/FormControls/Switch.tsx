import clsx from "clsx";
import { useEffect, useState } from "react";

type SwitchSize = "default" | "sm" | "lg";

type Props<T extends string | number | boolean> = {
  value?: T;
  onChange?: (value: T) => void;
  options: T[];
  size?: SwitchSize;
  className?: string;
  itemsClassName?: string;
  activeItemClassName?: string;
  getActiveItemClassName?: (option: T) => string | undefined;
} & Omit<React.DetailsHTMLAttributes<HTMLDivElement>, "onChange">;

export function Switch<T extends string | number | boolean>({
  onChange = () => {},
  options,
  value,
  size = "default",
  className,
  itemsClassName = "flex-1",
  activeItemClassName,
  getActiveItemClassName,
  ...props
}: Props<T>) {
  const fallbackOption = options[0];
  const [activeOption, setActiveOption] = useState(
    () => value ?? fallbackOption
  );
  const sizeClasses: Record<
    SwitchSize,
    { container: string; item: string; activeItem: string }
  > = {
    sm: {
      container: "rounded-md p-0.5",
      item: "px-2 py-1 text-xs",
      activeItem: "shadow-sm"
    },
    default: {
      container: "rounded-lg p-0.5",
      item: "p-1.5 lg:pl-2.5 lg:pr-3.5 text-sm",
      activeItem: "shadow-sm"
    },
    lg: {
      container: "rounded-lg p-1",
      item: "px-3 py-2 text-sm lg:px-4 lg:py-2.5",
      activeItem: "shadow"
    }
  };

  const activeClasses = clsx(
    "rounded-md flex items-center font-medium bg-white ring-1 ring-black ring-opacity-5",
    sizeClasses[size].item,
    sizeClasses[size].activeItem
  );
  const inActiveClasses = clsx(
    "rounded-md flex items-center font-medium",
    sizeClasses[size].item
  );

  function handleClick(view: T) {
    onChange(view);
  }

  useEffect(() => {
    setActiveOption(value ?? fallbackOption);
  }, [fallbackOption, value]);

  return (
    <div
      className={clsx(
        "group flex flex-row bg-gray-100 hover:bg-gray-200",
        sizeClasses[size].container,
        className
      )}
      {...props}
    >
      {options.map((option) => {
        return (
          <button
            type="button"
            className={`${itemsClassName} items-center whitespace-nowrap rounded-md text-sm font-medium text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100`}
            tabIndex={0}
            onClick={() => handleClick(option)}
            key={option.toString()}
          >
            <span
              className={clsx(
                activeOption === option ? activeClasses : inActiveClasses,
                activeOption === option && activeItemClassName,
                activeOption === option && getActiveItemClassName?.(option)
              )}
            >
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}
