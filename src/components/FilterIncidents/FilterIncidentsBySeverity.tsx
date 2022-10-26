import { Control } from "react-hook-form";
import { severityItems } from "../Incidents/data";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultSelections } from "./FilterIncidentsByComponents";

type Props = {
  control: Control<any, any>;
  value?: string;
};

export default function FilterIncidentsBySeverity({ control, value }: Props) {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-gray-500 text-sm">Severity</div>
      <ReactSelectDropdown
        control={control}
        name="severity"
        className="w-auto max-w-[400px] mr-2 flex-shrink-0"
        dropDownClassNames="w-auto max-w-[400px] right-0"
        value={value}
        /* @ts-expect-error */
        items={{ ...defaultSelections, ...severityItems }}
        hideControlBorder
      />
    </div>
  );
}
