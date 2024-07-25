import { useMemo } from "react";
import { useAllAgentNamesQuery } from "../../api/query-hooks";
import FormikFilterSelectDropdown from "../Forms/Formik/FormikFilterSelectDropdown";

type AgentNamesDropdownProps = {
  dropDownClassNames?: string;
  className?: string;
  name: string;
};

export function AgentNamesDropdown({
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
    <FormikFilterSelectDropdown
      isLoading={isLoading}
      items={agentOptionsItems}
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      hideControlBorder
      defaultValue="All"
      prefix={
        <div className="mr-2 whitespace-nowrap text-xs text-gray-500">
          Agent:
        </div>
      }
    />
  );
}
