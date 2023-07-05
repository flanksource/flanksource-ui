import clsx from "clsx";
import { ComponentProps } from "react";
import Select from "react-select";

export function SearchableDropdown({
  options,
  formatGroupLabel,
  defaultValue,
  className,
  ...props
}: ComponentProps<typeof Select>) {
  return (
    <Select
      defaultValue={defaultValue}
      options={options}
      formatGroupLabel={formatGroupLabel}
      className={clsx("text-sm", className)}
      {...props}
    />
  );
}
