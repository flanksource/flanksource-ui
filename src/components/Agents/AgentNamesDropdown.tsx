import { useMemo } from "react";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { useAllAgentNamesQuery } from "../../api/query-hooks";

type AgentNamesDropdownProps = {
  onChange?: (value: string | undefined) => void;
  searchParamKey?: string;
  paramsToReset?: Record<string, string>;
  value?: string;
  dropDownClassNames?: string;
  className?: string;
  name: string;
};

export function AgentNamesDropdown({
  onChange = () => {},
  value,
  name = "agent_id",
  dropDownClassNames = "w-auto max-w-[400px] left-0",
  className = "w-auto max-w-[400px]"
}: AgentNamesDropdownProps) {
  const { isLoading, data: agents } = useAllAgentNamesQuery({});

  const agentOptionsItems = useMemo(
    () => [
      {
        id: "All",
        name: "All",
        description: "All",
        value: "All"
      },
      ...(agents || []).map((item) => {
        return {
          id: item.id,
          name: item.id,
          description: item.name,
          value: item.id
        };
      })
    ],
    [agents]
  );

  return (
    <ReactSelectDropdown
      isLoading={isLoading}
      items={agentOptionsItems}
      name={name}
      onChange={(value) => {
        onChange(value);
      }}
      value={value}
      className={className}
      dropDownClassNames={dropDownClassNames}
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Agent:
        </div>
      }
    />
  );
}
