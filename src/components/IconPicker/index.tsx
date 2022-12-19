import { Icons } from "../../icons";
import { Icon } from "../Icon";
import { Select } from "../Select";

const iconList = Object.entries(Icons).map(([name, _icon]) => ({
  value: name,
  label: (
    <div className="flex pl-2 space-x-4 items-center">
      <Icon name={name} /> <span>{name}</span>
    </div>
  )
}));

interface Props {
  onChange: (val: { value: string }) => void;
  icon?: string | undefined;
}
export function IconPicker({ onChange, icon }: Props) {
  const value = iconList.find((x) => x.value === icon);

  return (
    <div className="w-72">
      <Select
        value={value}
        onChange={onChange}
        name="Icon"
        options={iconList}
      />
    </div>
  );
}
