import { HealthCheck } from "@flanksource-ui/api/types/health";
import {
  defaultTabSelections,
  getTabSelections
} from "@flanksource-ui/components/Dropdown/lib/lists";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import { useAtom } from "jotai";
import { ComponentProps } from "react";
import { AiFillContainer } from "react-icons/ai";
import { healthSettingsAtom } from "../../useHealthUserSettings";

export function ChecksTabByDropdown({
  checks,
  ...rest
}: ComponentProps<typeof ReactSelectDropdown> & {
  checks?: HealthCheck[];
  defaultValue?: string;
}) {
  const [settings, setSettings] = useAtom(healthSettingsAtom);

  const items = {
    ...getTabSelections(checks, defaultTabSelections),
    agent: {
      id: "agent_id",
      name: "agent_id",
      icon: <AiFillContainer />,
      description: "Agent",
      value: "agent_id",
      labelValue: null,
      key: "agent_id"
    }
  };

  return (
    <ReactSelectDropdown
      {...rest}
      items={items}
      value={settings.tabBy}
      onChange={(v) => {
        setSettings((prev) => ({
          ...prev,
          tabBy: v
        }));
      }}
    />
  );
}
