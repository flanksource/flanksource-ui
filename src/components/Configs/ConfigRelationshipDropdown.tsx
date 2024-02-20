import { useSearchParams } from "react-router-dom";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

const relationshipOptions = [
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
    value: "upstream"
  },
  {
    id: "Outgoing",
    name: "Outgoing",
    description: "Outgoing",
    value: "downstream"
  }
];

const searchParamKey = "relationshipType";

export function ConfigRelationshipDropdown() {
  const [params, setParams] = useSearchParams();

  const value = params.get(searchParamKey) ?? "none";

  return (
    <ReactSelectDropdown
      items={relationshipOptions}
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
        <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
          Relationship Type:
        </div>
      }
    />
  );
}
