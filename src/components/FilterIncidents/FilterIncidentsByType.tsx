import { Control } from "react-hook-form";
import { typeItems } from "../Incidents/data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultSelections } from "./FilterIncidentsByComponents";

type Props = {
  control: Control<any, any>;
  value?: string;
};

export default function FilterIncidentsByType({ control, value }: Props) {
  return (
    <div className="space-x-3 flex items-center">
      <div className="text-gray-500 text-sm">Type</div>
      <ReactSelectDropdown
        control={control}
        label=""
        name="type"
        className="w-auto max-w-[400px]"
        dropDownClassNames="w-auto max-w-[400px] right-0"
        value={value}
        items={{ ...defaultSelections, ...typeItems }}
        hideControlBorder
      />
    </div>
  );
}
