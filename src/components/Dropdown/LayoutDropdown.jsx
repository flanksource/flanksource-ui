import { BsTable } from "react-icons/bs";
import { RiLayoutGridLine } from "react-icons/ri";
import { ReactSelectDropdown } from "../ReactSelectDropdown";

export const layoutItems = {
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
  return <ReactSelectDropdown {...rest} items={layoutItems} />;
}
