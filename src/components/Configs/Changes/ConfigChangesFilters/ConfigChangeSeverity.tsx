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
    value: "All",
    colorClass: "text-gray-500 fill-gray-500"
  },
  Critical: {
    id: "dropdown-severity-critical",
    icon: <HiOutlineChevronDoubleUp color="red" />,
    name: "Critical",
    description: "Critical",
    value: "critical",
    colorClass: "text-red-500 fill-red-500"
  },
  High: {
    id: "dropdown-severity-high",
    icon: <HiOutlineMinus color="red" />,
    name: "High",
    description: "High",
    value: "high",
    colorClass: "text-red-500 fill-red-500"
  },
  Medium: {
    id: "dropdown-severity-medium",
    icon: <HiOutlineChevronDown color="orange" />,
    name: "Medium",
    description: "Medium",
    value: "medium",
    colorClass: "text-orange-500 fill-orange-500"
  },
  Low: {
    id: "dropdown-severity-low",
    icon: <HiOutlineChevronDoubleDown color="orange" />,
    name: "Low",
    description: "Low",
    value: "low",
    colorClass: "fill-orange-500 text-orange-500"
  },
  Info: {
    id: "dropdown-severity-info",
    icon: <HiInformationCircle className="text-gray-500" />,
    name: "Info",
    description: "Info",
    value: "Info",
    colorClass: "text-gray-500 fill-gray-500"
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
