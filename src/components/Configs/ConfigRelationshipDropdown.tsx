import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

const configRelationshipOptions = [
  {
    id: "None",
    name: "None",
    description: "None",
    value: "none"
  },
  {
    id: "All",
    name: "All",
    description: "All",
    value: "all"
  },
  {
    id: "Incoming",
    name: "Incoming",
    description: "Incoming",
    value: "incoming"
  },
  {
    id: "Outgoing",
    name: "Outgoing",
    description: "Outgoing",
    value: "outgoing"
  }
];

const changesRelationshipOptions = [
  {
    id: "None",
    name: "None",
    description: "None",
    value: "none"
  },
  {
    id: "All",
    name: "All",
    description: "All",
    value: "both"
  },
  {
    id: "Downstream",
    name: "Downstream",
    description: "Downstream",
    value: "downstream"
  },
  {
    id: "Upstream",
    name: "Upstream",
    description: "Upstream",
    value: "upstream"
  }
];

const searchParamKey = "relationshipType";

type ConfigRelationshipDropdownProps = {
  isConfigChanges?: boolean;
};

export function ConfigRelationshipDropdown({
  isConfigChanges = false
}: ConfigRelationshipDropdownProps) {
  const [params, setParams] = useSearchParams();

  const value = params.get(searchParamKey) ?? "none";

  return (
    <ReactSelectDropdown
      items={
        isConfigChanges ? changesRelationshipOptions : configRelationshipOptions
      }
      name="Relationship"
      onChange={(value) => {
        if (value === "none" || !value) {
          params.delete(searchParamKey);
        } else {
          params.set(searchParamKey, value);
        }
        setParams(params);
      }}
      value={value}
      className="w-auto max-w-[400px]"
      dropDownClassNames="w-auto max-w-[400px] left-0"
      hideControlBorder
      prefix={
        <div className="text-xs text-gray-500 whitespace-nowrap">
          Relationship Type:
        </div>
      }
    />
  );
}
