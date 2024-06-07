import { IconMap as Icons } from "@flanksource/icons/mi";
import { Select } from "../../components/Select";
import { Icon } from "./Icon";
const iconList = Object.entries(Icons).map(([name, _icon]) => ({
  value: name,
  label: (
    <div className="flex pl-2 space-x-4 items-center">
      <Icon name={name} className="w-5 h-auto" /> <span>{name}</span>
    </div>
  )
}));

interface Props {
  onChange: (val: { value: string }) => void;
  icon?: string | undefined;
  name?: string;
  className?: string;
}
export function IconPicker({
  onChange,
  icon,
  name = "Icon",
  className = "w-72"
}: Props) {
  const value = iconList.find((x) => x.value === icon);

  return (
    <div className={className}>
      <Select
        value={value}
        onChange={onChange}
        name={name}
        options={iconList}
      />
    </div>
  );
}
