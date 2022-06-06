import Select from "react-select";

export function SearchableDropdown({
  options,
  formatGroupLabel,
  defaultValue,
  ...props
}) {
  return (
    <Select
      defaultValue={defaultValue}
      options={options}
      formatGroupLabel={formatGroupLabel}
      {...props}
    />
  );
}
