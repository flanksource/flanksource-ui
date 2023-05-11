import { useState } from "react";

type Props = React.HTMLProps<HTMLDivElement> & {
  label: React.ReactNode;
  labelClassName?: string;
  children: React.ReactNode;
  isChecked?: boolean;
  onChange?: (v: boolean) => void;
};

export default function CheckboxCollapsibleGroup({
  label,
  children,
  isChecked = false,
  className = "flex-1 flex flex-col  px-2 py-2 transform origin-top duration-1000 overflow-y-auto",
  labelClassName = "flex-1 font-semibold",
  onChange = () => {},
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(isChecked);

  return (
    <div className={`flex flex-col`}>
      <div
        className={`flex flex-row items-center space-x-2 py-2 px-2 cursor-pointer`}
      >
        <input
          className="text-blue-600 bg-gray-100 border-gray-900 rounded focus:ring-blue-500 focus:ring-2"
          type="checkbox"
          id={`hideFieldGroups-${label}`}
          checked={isOpen}
          onChange={(v) => {
            setIsOpen(v.target.checked);
            onChange(v.target.checked);
          }}
        />
        <label htmlFor={`hideFieldGroups-${label}`} className={labelClassName}>
          {label}
        </label>
      </div>
      <div className={`${className} ${isOpen ? "" : "hidden"}`} {...props}>
        {children}
      </div>
    </div>
  );
}
