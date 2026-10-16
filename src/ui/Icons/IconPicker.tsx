import { IconMap as Icons } from "@flanksource/icons/mi";
import { Select } from "../../components/Select";
import { Icon } from "./Icon";
const iconList = Object.entries(Icons).map(([name, _icon]) => ({
  value: name,
  label: (
    <div className="flex items-center space-x-4 pl-2">
      <Icon name={name} className="h-auto w-5" /> <span>{name}</span>
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
        // Render the menu outside scrollable containers such as modal bodies, which would clip it
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        styles={{ menuPortal: (base: object) => ({ ...base, zIndex: 9999 }) }}
      />
    </div>
  );
}
