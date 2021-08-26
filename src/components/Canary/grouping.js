import { ImUngroup } from "react-icons/im";
import { BiLabel } from "react-icons/bi";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { getNonBooleanLabels } from "./labels";

import { getNonBooleanLabels } from "./labels";

export const defaultGroupSelections = [
  {
    id: "dropdown-no-group",
    name: "no-group",
    icon: <ImUngroup />,
    label: "No Grouping"
  },
  {
    id: "dropdown-name",
    name: "name",
    icon: <TiSortAlphabeticallyOutline />,
    label: "Name"
  },
  {
    id: "dropdown-description",
    name: "description",
    icon: <AiOutlineAlignLeft />,
    label: "Description"
  }
];

// provide a list of group selections that includes (non-boolean) labels, given a list of checks.
export function getGroupSelections(checks) {
  const nonBooleanLabels = getNonBooleanLabels(checks);
  const newGroupSelections = [...defaultGroupSelections];
  nonBooleanLabels.forEach((label) => {
    const onlyAlphabets = label.replace(/[^a-zA-Z]/g, "");
    newGroupSelections.push({
      id: `dropdown-label-${onlyAlphabets}`,
      name: onlyAlphabets,
      icon: <BiLabel />,
      label,
      groupLabelKey: label
    });
  });
  return newGroupSelections;
}

// process table groupings, given a list of checks and a 'groupBy' object
export function getGroupedChecks(checks, groupBy) {
  if (groupBy.name === "name" || groupBy.name === "description") {
    // case A: grouping by 'name' or 'description'
    const groupedChecks = {};
    const groupNames = [];
    checks.forEach((check) => {
      const value = check[groupBy.name];
      // if current name/description doesn't exist yet
      if (groupNames.indexOf(value) === -1) {
        // add name/description to list
        groupNames.push(value);
        // create new group entry on groupedChecks
        groupedChecks[value] = [];
      }
      // push check object to group
      groupedChecks[value].push(check);
    });
    return groupedChecks;
  }
  // case B: grouping by labels
  const groupedChecks = { Others: [] };
  const groupNames = ["Others"];
  // find checks with matching labels
  checks.forEach((check) => {
    let hasValidGroup = false;
    let groupName;
    if (check.labels) {
      const labelKeys = Object.keys(check.labels);
      labelKeys.forEach((key) => {
        // if current item has a matching label with the currently selected groupBy
        if (key === groupBy.groupLabelKey) {
          hasValidGroup = true;
          groupName = check.labels[key];
          // if current groupName doesn't exist yet
          if (groupNames.indexOf(groupName) === -1) {
            // add name/description to list
            groupNames.push(groupName);
            // create new group entry on groupedChecks
            groupedChecks[groupName] = [];
          }
        }
      });
    }
    if (hasValidGroup) {
      // push check object to group if it has a valid group
      groupedChecks[groupName].push(check);
    } else {
      // if no valid group, place check into "Others" group
      groupedChecks.Others.push(check);
    }
  });
  return groupedChecks;
}
