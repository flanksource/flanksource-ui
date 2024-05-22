import { HealthCheck } from "@flanksource-ui/api/types/health";
import {
  defaultTabSelections,
  getTabSelections
} from "@flanksource-ui/components/Dropdown/lib/lists";
import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import { ComponentProps } from "react";
import { AiFillContainer } from "react-icons/ai";

export function ChecksTabByDropdown({
  checks,
  ...rest
}: ComponentProps<typeof ReactSelectDropdown> & {
  checks?: HealthCheck[];
  defaultValue?: string;
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

  return <FormikFilterSelectDropdown {...rest} items={items} />;
}
