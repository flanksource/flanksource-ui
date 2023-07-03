import clsx from "clsx";
import Select from "react-select";

export function SearchableDropdown({
  options,
  formatGroupLabel,
  defaultValue,
  className,
  ...props
}) {
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
