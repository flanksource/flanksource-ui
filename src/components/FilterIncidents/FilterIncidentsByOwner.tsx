import { Control } from "react-hook-form";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultSelections } from "./FilterIncidentsByComponents";

type Props = {
  control: Control<any, any>;
  value?: string;
  ownerSelections: any[] | null;
};

export default function FilterIncidentsByOwner({
  control,
  value,
  ownerSelections
}: Props) {
  return (
    <div className="flex items-center space-x-3">
      <div className=" text-gray-500 text-sm">Owner</div>
      <ReactSelectDropdown
        control={control}
        name="owner"
        className="w-auto max-w-[400px] mr-2 flex-shrink-0"
        dropDownClassNames="w-auto max-w-[400px] right-0"
        value={value}
        // @ts-expect-error
        items={{ ...defaultSelections, ...ownerSelections }}
        hideControlBorder
      />
    </div>
  );
}
