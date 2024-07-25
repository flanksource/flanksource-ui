import { Control } from "react-hook-form";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import { defaultSelections } from "../data";

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
    <div className="mr-2 flex items-center space-x-3">
      <ReactSelectDropdown
        control={control}
        name="owner"
        prefix="Owner:"
        className="w-auto max-w-[400px] flex-shrink-0"
        dropDownClassNames="w-auto max-w-[400px]"
        value={value}
        // @ts-expect-error
        items={{ ...defaultSelections, ...ownerSelections }}
        hideControlBorder
      />
    </div>
  );
}
