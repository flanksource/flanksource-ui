import { CellContext } from "@tanstack/react-table";
import { ConfigItem, ConfigSummary } from "../../../../api/types/configs";
import { Icon } from "../../../Icon";
import { useMemo } from "react";

export default function ConfigListTypeCell({
  getValue
}: CellContext<ConfigItem, unknown> | CellContext<ConfigSummary, unknown>) {
  const configType = getValue<ConfigItem["type"]>();

  const [primaryIcon, secondaryIcon] = useMemo(() => {
    if (configType?.split("::").length === 1) {
      return [configType, undefined];
    }
    const primaryIcon = configType?.split("::")[0];
    const secondaryIcon = configType?.substring(configType.indexOf("::") + 2);

    return [primaryIcon, secondaryIcon];
  }, [configType]);

  const value = useMemo(() => {
    if (configType?.split("::").length === 1) {
      return configType;
    }
    return configType
      ?.substring(configType.indexOf("::") + 2)
      .replaceAll("::", " ")
      .trim();
  }, [configType]);

  return (
    <span className="flex flex-nowrap gap-1">
      <Icon
        name={primaryIcon}
        secondary={primaryIcon}
        className="max-h-5 max-w-[1.25rem]"
      />
      <Icon
        name={secondaryIcon}
        secondary={secondaryIcon}
        className="max-h-5 max-w-[1.25rem]"
        prefix={<span className="1">/</span>}
      />
      <span className="pl-1"> {value}</span>
    </span>
  );
}
