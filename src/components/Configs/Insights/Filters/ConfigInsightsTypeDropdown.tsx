import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import React from "react";
import ConfigInsightsIcon from "../ConfigInsightsIcon";

export const configAnalysisTypeItems = {
  Cost: {
    id: "dropdown-type-cost",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "cost", severity: "" }}
        size={18}
      />
    ),
    label: "Cost",
    value: "cost"
  },
  Availability: {
    id: "dropdown-type-availability",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "availability", severity: "" }}
        size={18}
      />
    ),
    label: "Availability",
    value: "availability"
  },
  Performance: {
    id: "dropdown-type-performance",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "performance", severity: "" }}
        size={18}
      />
    ),
    label: "Performance",
    value: "performance"
  },
  Security: {
    id: "dropdown-type-security",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "security", severity: "" }}
        size={18}
      />
    ),
    label: "Security",
    value: "security"
  },
  Integration: {
    id: "dropdown-type-integration",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "integration", severity: "" }}
        size={18}
      />
    ),
    label: "Integration",
    value: "integration"
  },
  Compliance: {
    id: "dropdown-type-compliance",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "compliance", severity: "" }}
        size={18}
      />
    ),
    label: "Compliance",
    value: "compliance"
  },
  TechnicalDebt: {
    id: "dropdown-type-technical-debt",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "technical_debt", severity: "" }}
        size={18}
      />
    ),
    label: "Technical Debt",
    value: "technical_debt"
  },
  Reliability: {
    id: "dropdown-type-reliability",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "reliability", severity: "" }}
        size={18}
      />
    ),
    label: "Reliability",
    value: "reliability"
  },
  Recommendation: {
    id: "dropdown-type-recommendation",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "recommendation", severity: "" }}
        size={18}
      />
    ),
    label: "Recommendation",
    value: "recommendation"
  },
  Other: {
    id: "dropdown-type-other",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "other", severity: "" }}
        size={18}
      />
    ),
    label: "Other",
    value: "other"
  }
} as const;

type Props = React.HTMLProps<HTMLDivElement> & {
  label?: string;
};

export default function ConfigInsightsTypeDropdown({
  label = "Type",
  name = "type"
}: Props) {
  const [field] = useField({
    name
  });

  const options = Object.values(configAnalysisTypeItems)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((item) => ({
      id: item.id,
      label: item.label,
      value: item.value,
      icon: item.icon
    })) satisfies TriStateOptions[];

  return (
    <TristateReactSelect
      options={options}
      value={field.value}
      minMenuWidth="16rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({
            target: { name, value }
          });
        } else {
          field.onChange({
            target: { name, value: undefined }
          });
        }
      }}
      label={label}
    />
  );
}
