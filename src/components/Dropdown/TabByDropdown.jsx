import { BiLabel } from "react-icons/bi";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { Dropdown } from ".";
import { getUniqueNonBooleanLabelKeys } from "../Canary/labels";

export const defaultTabSelections = {
  namespace: {
    id: "namespace",
    name: "namespace",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Namespace",
    value: "namespace",
    labelValue: null,
    key: "namespace"
  }
};

// provide a list of tab selections that includes (non-boolean) labels, given a list of checks.
export function getTabSelections(checks, defaultTabSelections) {
  const uniqueLabelKeys = getUniqueNonBooleanLabelKeys(checks);
  const newTabSelections = defaultTabSelections;

  Object.entries(uniqueLabelKeys)
    .sort((a, b) => (b[0] > a[0] ? -1 : 1))
    .forEach((o) => {
      const k = o[0];
      const onlyAlphabets = k.replace(/[^a-zA-Z]/g, "");
      newTabSelections[k] = {
        id: k,
        name: onlyAlphabets,
        icon: <BiLabel />,
        description: k,
        value: k,
        labelValue: k,
        key: k
      };
    });
  return newTabSelections;
}

export function TabByDropdown({ checks, ...rest }) {
  const items = getTabSelections(checks, defaultTabSelections);
  return <Dropdown {...rest} items={items} />;
}
