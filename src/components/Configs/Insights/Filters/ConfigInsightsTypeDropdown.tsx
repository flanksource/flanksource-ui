import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";
import ConfigInsightsIcon from "../ConfigInsightsIcon";

// Full set of analysis type definitions with icons, keyed by value.
export const configAnalysisTypeItems: Record<
  string,
  { id: string; label: string; value: string; icon: React.ReactNode }
> = {
  availability: {
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
  compliance: {
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
  cost: {
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
  integration: {
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
  other: {
    id: "dropdown-type-other",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "other", severity: "" }}
        size={18}
      />
    ),
    label: "Other",
    value: "other"
  },
  performance: {
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
  recommendation: {
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
  reliability: {
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
  security: {
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
  technical_debt: {
    id: "dropdown-type-technical-debt",
    icon: (
      <ConfigInsightsIcon
        analysis={{ analysis_type: "technical_debt", severity: "" }}
        size={18}
      />
    ),
    label: "Technical Debt",
    value: "technical_debt"
  }
};

type Props = {
  name?: string;
  label?: string;
  /** Values returned by the SP — only types present in the data are shown. */
  options?: string[];
  isLoading?: boolean;
};

export default function ConfigInsightsTypeDropdown({
  name = "type",
  label = "Type",
  options: availableTypes = [],
  isLoading = false
}: Props) {
  const [field] = useField({ name });

  const options = useMemo(() => {
    const typeSet = new Set(availableTypes);
    return Object.values(configAnalysisTypeItems)
      .filter(({ value }) => typeSet.size === 0 || typeSet.has(value))
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(({ id, label, value, icon }) => ({
        id,
        label,
        value,
        icon
      })) satisfies TriStateOptions[];
  }, [availableTypes]);

  return (
    <TristateReactSelect
      options={options}
      isLoading={isLoading}
      value={field.value}
      minMenuWidth="16rem"
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({ target: { name, value } });
        } else {
          field.onChange({ target: { name, value: undefined } });
        }
      }}
      label={label}
    />
  );
}
