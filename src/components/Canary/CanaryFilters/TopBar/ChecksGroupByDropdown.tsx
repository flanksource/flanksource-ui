import { HealthCheck } from "@flanksource-ui/api/types/health";
import { getLabelSelections } from "@flanksource-ui/components/Dropdown/lib/lists";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import { useAtom } from "jotai";
import { ComponentProps } from "react";
import { HiOutlineServerStack } from "react-icons/hi2";
import { ImUngroup } from "react-icons/im";
import { PiTextTBold } from "react-icons/pi";
import { TbBox } from "react-icons/tb";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { healthSettingsAtom } from "../../useHealthUserSettings";

const defaultGroupSelections = {
  "no-group": {
    id: "no-group",
    name: "no-group",
    icon: <ImUngroup />,
    description: "No Grouping",
    value: "no-group",
    labelValue: null,
    key: "no-group"
  },
  canary_name: {
    id: "canary_name",
    name: "canary_name",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Group Name",
    value: "canary_name",
    labelValue: null,
    key: "canary_name"
  },
  name: {
    id: "name",
    name: "name",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Name",
    value: "name",
    labelValue: null,
    key: "name"
  },
  description: {
    id: "description",
    name: "description",
    icon: <PiTextTBold />,
    description: "Description",
    value: "description",
    labelValue: null,
    key: "description"
  },
  type: {
    id: "type",
    name: "type",
    icon: <TbBox />,
    description: "Type",
    value: "type",
    labelValue: null,
    key: "type"
  },
  agent: {
    id: "agent",
    name: "agent",
    icon: <HiOutlineServerStack />,
    description: "Agent",
    value: "agent",
    labelValue: null,
    key: "agent"
  }
};

type Props = {
  checks?: HealthCheck[];
  defaultValue?: string;
} & ComponentProps<typeof ReactSelectDropdown>;

export function ChecksGroupByDropdown({ checks, ...rest }: Props) {
  const [value, setValue] = useAtom(healthSettingsAtom);
  const items = getLabelSelections(checks, defaultGroupSelections);
  return (
    <ReactSelectDropdown
      {...rest}
      items={items}
      value={value.groupBy}
      onChange={(v) =>
        setValue((prev) => ({
          ...prev,
          groupBy: v
        }))
      }
    />
  );
}
