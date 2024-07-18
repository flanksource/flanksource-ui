import React from "react";
import { Control } from "react-hook-form";
import { ComponentNamesDropdown } from "../../Topology/Dropdowns/ComponentNamesDropdown";

export type TopologyComponentItem = {
  created_at?: string;
  external_id?: string;
  icon?: string;
  id?: string;
  name?: string;
  parent_id?: string;
  type?: string;
  updated_at?: string;
};

type Props = {
  control: Control<any, any>;
  value?: string;
};

function FilterIncidentsByComponents({ control, value }: Props) {
  return (
    <div className="mr-2 flex flex-row items-center space-x-3">
      <ComponentNamesDropdown
        prefix="Component:"
        name="component"
        className="w-auto max-w-[400px] capitalize"
        value={value}
        dropDownClassNames="w-auto max-w-[40rem]"
        hideControlBorder
      />
    </div>
  );
}

export default React.memo(FilterIncidentsByComponents);
