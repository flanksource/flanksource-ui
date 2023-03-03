import React from "react";
import { Control } from "react-hook-form";
import ConfigInsightsIcon from "../ConfigInsightsIcon";
import { defaultSelections } from "../Incidents/data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export const configAnalysisTypeItems = {
  Cost: {
    id: "dropdown-type-cost",
    icon: (
      <ConfigInsightsIcon analysis={{ analysis_type: "cost", severity: "" }} />
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
      />
    ),
    name: "Technical Debt",
    description: "Technical Debt",
    value: "technical_debt"
  }
} as const;

type Props = React.HTMLProps<HTMLDivElement> & {
  control?: Control<any, any>;
  value?: string;
  prefix?: string;
  dropDownClassNames?: string;
  hideControlBorder?: boolean;
  showAllOption?: boolean;
};

export default function ConfigAnalysisTypeDropdown({
  control,
  value,
  prefix = "Severity:",
  name = "severity",
  className,
  showAllOption,
  dropDownClassNames,
  hideControlBorder
}: Props) {
  return (
    <ReactSelectDropdown
      control={control}
      prefix={prefix}
      name={name}
      className={className}
      dropDownClassNames={dropDownClassNames}
      value={value}
      items={{
        ...(showAllOption ? defaultSelections : {}),
        ...configAnalysisTypeItems
      }}
      hideControlBorder={hideControlBorder}
    />
  );
}
