import { Control } from "react-hook-form";
import { statusItems } from "../Incidents/data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultSelections } from "./FilterIncidentsByComponents";

type Props = {
  control: Control<any, any>;
  value?: string;
};

export default function FilterIncidentsByStatus({ control, value }: Props) {
  return (
    <div className="flex items-center space-x-3">
      <ReactSelectDropdown
        control={control}
        name="status"
        prefix="Status:"
        className="w-auto max-w-[400px] mr-2 flex-shrink-0"
        dropDownClassNames="w-auto max-w-[400px] right-0"
        value={value}
        items={{ ...defaultSelections, ...statusItems }}
        hideControlBorder
      />
    </div>
  );
}
