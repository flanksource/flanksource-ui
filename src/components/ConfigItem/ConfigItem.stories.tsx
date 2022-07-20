import { useState } from "react";
import { ConfigItem } from "./index";

const ConfigItemDropDown = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <div className="flex">
      <ConfigItem
        className="w-56"
        type="EC2Instance"
        value={selectedItem}
        onSelect={(item) => setSelectedItem(item)}
      />
    </div>
  );
};

export default {
  title: "ConfigItem",
  component: ConfigItem
};

const Template = (arg) => <ConfigItemDropDown {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {};
