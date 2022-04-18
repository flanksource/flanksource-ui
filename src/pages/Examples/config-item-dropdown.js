import React, { useState } from "react";
import { MinimalLayout } from "../../components/Layout";
import { ConfigItem } from "../../components/ConfigItem/config-item";

export const ConfigItemDropDown = () => {
  const [type, setType] = useState("Subnet");
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <MinimalLayout>
      <div className="mb-3">
        <div className="flex items-center">
          <p className="mr-3">Select Type: </p>
          <button
            type="button"
            className="bg-blue-200 rounded p-2 mr-3"
            onClick={() => setType("Subnet")}
          >
            Subnet
          </button>
          <button
            type="button"
            className="bg-blue-200 rounded p-2"
            onClick={() => setType("EC2Instance")}
          >
            EC2Instance
          </button>
        </div>
        <div>
          <p>Current type: {type}</p>
        </div>
      </div>

      <ConfigItem type={type} onSelect={(item) => setSelectedItem(item)} />
      <div className="mt-3">
        <p>Selected item: </p>
        <pre>{JSON.stringify(selectedItem, null, "\t")}</pre>
      </div>
    </MinimalLayout>
  );
};
