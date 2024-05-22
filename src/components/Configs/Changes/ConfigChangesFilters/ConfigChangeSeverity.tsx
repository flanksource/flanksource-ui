import { useField } from "formik";
import {
  HiInformationCircle,
  HiOutlineChevronDoubleDown,
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineMinus
} from "react-icons/hi";
import { ReactSelectDropdown } from "../../../ReactSelectDropdown";

type Props = {
  searchParamKey?: string;
};

export const configChangeSeverity = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  },
  Critical: {
    id: "dropdown-severity-critical",
    icon: <HiOutlineChevronDoubleUp color="red" />,
    name: "Critical",
    description: "Critical",
    value: "critical"
  },
  High: {
    id: "dropdown-severity-high",
    icon: <HiOutlineMinus color="orange" />,
    name: "High",
    description: "High",
    value: "high"
  },
  Medium: {
    id: "dropdown-severity-medium",
    icon: <HiOutlineChevronDown color="green" />,
    name: "Medium",
    description: "Medium",
    value: "medium"
  },
  Low: {
    id: "dropdown-severity-low",
    icon: <HiOutlineChevronDoubleDown color="green" />,
    name: "Low",
    description: "Low",
    value: "low"
  },
  Info: {
    id: "dropdown-severity-info",
    icon: <HiInformationCircle className="text-gray-500" />,
    name: "Info",
    description: "Info",
    value: "Info"
  }
} as const;

export function ConfigChangeSeverity({ searchParamKey = "severity" }: Props) {
  const [field] = useField({
    name: searchParamKey
  });

  return (
    <ReactSelectDropdown
      items={configChangeSeverity}
      name="severity"
      onChange={(value) => {
        if (value && value !== "All") {
          field.onChange({ target: { name: searchParamKey, value: value } });
        } else {
          field.onChange({
            target: { name: searchParamKey, value: undefined }
          });
        }
      }}
      value={field.value ?? "All"}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 whitespace-nowrap">Severity:</div>
      }
    />
  );
}
