import clsx from "clsx";
import { ComponentProps } from "react";
import Select, { components } from "react-select";

type SelectDropdownProps<TValue = string> = {
  options: {
    label: string;
    value: TValue;
    icon?: React.ReactNode;
  }[];
  value?: TValue;
  onChange: (value: TValue) => void;
} & Omit<ComponentProps<Select>, "onChange" | "value" | "options">;

export default function SelectDropdown<TValue = string>({
  options,
  value,
  onChange = () => {},
  ...props
}: SelectDropdownProps<TValue>) {
  return (
    <Select
      {...props}
      options={options}
      value={options.find((e) => e.value === value)}
      onChange={(e) => {
        return onChange((e as any).value);
      }}
      openMenuOnClick
      openMenuOnFocus
      components={{
        SingleValue: ({ className, ...props }: any) => {
          return (
            <components.SingleValue
              className={clsx(className, "text-sm")}
              {...props}
            >
              <div
                className="flex flex-row gap-2 items-center cursor-pointer"
                role="button"
              >
                <span>{props.data.icon}</span> <span>{props.data.label}</span>
              </div>
            </components.SingleValue>
          );
        },
        Option: ({ className, ...props }: any) => {
          return (
            <components.Option {...props}>
              <div
                className="flex flex-row gap-2 items-center cursor-pointer"
                role="button"
              >
                <span>{props.data.icon}</span> <span>{props.data.label}</span>
              </div>
            </components.Option>
          );
        }
      }}
    />
  );
}
