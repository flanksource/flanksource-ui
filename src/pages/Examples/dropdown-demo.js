import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BsAlarm, BsApp, BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";
import { Dropdown } from "../../components/Dropdown";
import { GroupByDropdown } from "../../components/Dropdown/GroupByDropdown";
import { SearchLayout } from "../../components/Layout";

const exampleItems = {
  table: {
    id: "dropdown-table",
    name: "table",
    icon: <BsTable />,
    description: "Table",
    value: "table"
  },
  card: {
    id: "dropdown-card",
    name: "card",
    icon: <RiLayoutGridLine />,
    description: "Card",
    value: "card"
  }
};

const exampleItems2 = {
  item1: {
    id: "item1",
    icon: <BsAlarm />,
    description: "Item1",
    value: "item1"
  },
  item2: {
    id: "item2",
    icon: <BsApp />,
    description: "Item2",
    value: "item2"
  }
};

export const exampleItems3 = {
  item1: {
    id: "item1",
    name: "item1",
    icon: <BsAlarm />,
    description: "item1",
    value: "item1",
    key: "item1"
  },
  item2: {
    id: "item2",
    name: "item2",
    icon: <BsAlarm />,
    description: "item2",
    value: "item2",
    key: "item2"
  },
  item3: {
    id: "item3",
    name: "item3",
    icon: <BsAlarm />,
    description: "item3",
    value: "item3",
    key: "item3"
  }
};

export function DropdownDemoPage() {
  const [selected, setSelected] = useState(exampleItems.table.value);
  const [selected2, setSelected2] = useState(null);

  const { control } = useForm({
    defaultValues: { dropdownControlled: "item1" }
  });

  return (
    <SearchLayout title="Dropdown Demo">
      <div className="mb-6">
        <h1 className="mb-4 font-semibold">
          Dropdown without Control from React Hooks Form
        </h1>
        <Dropdown
          items={exampleItems}
          onChange={(value) => setSelected(value)}
          value={selected}
        />
      </div>
      <div className="mb-6">
        <h1 className="mb-4 font-semibold">Dropdown with placeholder</h1>
        <div className="mb-2 text-sm">
          {selected2
            ? `The selected item's value is not null (${selected2}).`
            : "The selected item's value is null."}
        </div>
        <Dropdown
          items={exampleItems2}
          onChange={(value) => setSelected2(value)}
          value={selected2}
          placeholder="Please select a value"
        />
      </div>
      <div className="mb-6">
        <h1 className="mb-4 font-semibold">Emptyable Dropdown with 0 items</h1>
        <Dropdown items={{}} emptyable />
      </div>
      <div className="mb-6">
        <h1 className="mb-4 font-semibold">
          Dropdown that uses React Hook Form and Control
        </h1>
        <Dropdown
          items={exampleItems3}
          name="dropdownControlled"
          control={control}
          label="Controlled Dropdown"
        />
      </div>

      <p className="mb-6 text-sm">
        Check out{" "}
        <code className="text-xs">/src/pages/Examples/dropdown-demo.js</code>{" "}
        for code example
      </p>
    </SearchLayout>
  );
}
