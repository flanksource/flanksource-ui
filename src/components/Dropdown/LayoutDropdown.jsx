import React from "react";
import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";
import { Dropdown } from ".";

const layoutItems = {
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

export function LayoutDropdown({ items, ...rest }) {
  return <Dropdown {...rest} items={layoutItems} />;
}
