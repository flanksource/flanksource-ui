import { useField } from "formik";
import React from "react";
import { defaultSelections } from "../../../Incidents/data";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";
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
    name: "Cost",
    description: "Cost",
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
    name: "Availability",
    description: "Availability",
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
    name: "Performance",
    description: "Performance",
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
    name: "Security",
    description: "Security",
    value: "security"
  },
  integration: {
    id: "dropdown-type-integration",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "integration", severity: "" }}
        size={18}
      />
    ),
    name: "Integration",
    description: "Integration",
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
    name: "Compliance",
    description: "Compliance",
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
    name: "Technical Debt",
    description: "Technical Debt",
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
    name: "Reliability",
    description: "Reliability",
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
    name: "Recommendation",
    description: "Recommendation",
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
    name: "Other",
    description: "Other",
    value: "other"
  }
} as const;

type Props = React.HTMLProps<HTMLDivElement> & {
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export default function ConfigInsightsTypeDropdown({
  prefix = "Type:",
  name = "type",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder
}: Props) {
  const [field] = useField({
    name
  });

  return (
    <ReactSelectDropdown
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
      prefix={
        <div className="whitespace-nowrap text-xs text-gray-500">{prefix}</div>
      }
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={field.value ?? "all"}
      items={{
        ...(showAllOption ? defaultSelections : {}),
        ...Object.values(configAnalysisTypeItems).sort((a, b) =>
          a.name > b.name ? 1 : -1
        )
      }}
      hideControlBorder={hideControlBorder}
    />
  );
}
