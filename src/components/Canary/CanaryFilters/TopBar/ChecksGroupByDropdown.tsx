import { HealthCheck } from "@flanksource-ui/api/types/health";
import { getLabelSelections } from "@flanksource-ui/components/Dropdown/lib/lists";
import FormikFilterSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikFilterSelectDropdown";
import { ReactSelectDropdown } from "@flanksource-ui/components/ReactSelectDropdown";
import { ComponentProps } from "react";
import { ImUngroup } from "react-icons/im";
import { PiTextTBold } from "react-icons/pi";
import { TbBox } from "react-icons/tb";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";

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
  }
};

type Props = {
  checks?: HealthCheck[];
  defaultValue?: string;
} & ComponentProps<typeof ReactSelectDropdown>;

export function ChecksGroupByDropdown({ checks, ...rest }: Props) {
  const items = getLabelSelections(checks, defaultGroupSelections);
  return <FormikFilterSelectDropdown {...rest} items={items} />;
}