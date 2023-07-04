import { ReactSelectDropdown, StateOption } from "../../ReactSelectDropdown";

type ComponentTypesDropdownProps = React.HTMLProps<HTMLDivElement> & {
  onChange: (val: any) => void;
  value: string | StateOption | undefined;
  topologyTypes: StateOption[];
};

export function ComponentTypesDropdown({
  name = "component-names",
  label,
  className,
  value,
  onChange,
  topologyTypes,
  ...rest
}: ComponentTypesDropdownProps) {
  return (
    <div className={className} {...rest}>
      <ReactSelectDropdown
        label={label}
        name={name}
        value={value}
        items={topologyTypes}
        className="inline-block p-3 w-auto max-w-[500px]"
        dropDownClassNames="w-auto max-w-[400px] left-0"
        onChange={(val: any) => {
          onChange(val);
        }}
        prefix={
          <div className="text-sm text-gray-500 mr-2 whitespace-nowrap">
            {`${name}:`}
          </div>
        }
      />
    </div>
  );
}
