import { ComponentProps } from "react";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultTabSelections, getTabSelections } from "./lib/lists";
import { AiFillContainer } from "react-icons/ai";

export function TabByDropdown({
  checks,
  ...rest
}: ComponentProps<typeof ReactSelectDropdown> & {
  checks?: any[];
}) {
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

  return <ReactSelectDropdown {...rest} items={items} />;
}
