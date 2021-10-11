import { ImUngroup } from "react-icons/im";
import { BiLabel } from "react-icons/bi";
import { TiSortAlphabeticallyOutline } from "react-icons/ti";
import { AiOutlineAlignLeft } from "react-icons/ai";
import { getNonBooleanLabels } from "./labels";

export const defaultGroupSelections = {
  "no-group": {
    id: "no-group",
    name: "no-group",
    icon: <ImUngroup />,
    description: "No Grouping",
    value: "no-group",
    labelValue: null,
    key: "no-group"
  },
  name: {
    id: "name",
    name: "name",
    icon: <TiSortAlphabeticallyOutline />,
    description: "Name",
    value: "name",
    labelValue: null,
    key: "name"
  },
  description: {
    id: "description",
    name: "description",
    icon: <AiOutlineAlignLeft />,
    description: "Description",
    value: "description",
    labelValue: null,
    key: "description"
  }
};

// provide a list of group selections that includes (non-boolean) labels, given a list of checks.
export function getGroupSelections(checks, defaultGroupSelections) {
  const nonBooleanLabels = getNonBooleanLabels(Object.values(checks));
  const newGroupSelections = defaultGroupSelections;

  const uniqueLabels = [
    ...new Set(Object.values(nonBooleanLabels).map((o) => o.key))
  ];
  uniqueLabels.forEach((label) => {
    const onlyAlphabets = label.replace(/[^a-zA-Z]/g, "");
    newGroupSelections[label] = {
      id: label,
      name: onlyAlphabets,
      icon: <BiLabel />,
      description: label,
      value: label,
      labelValue: label,
      key: label
    };
  });
  return newGroupSelections;
}

// process table groupings, given a list of checks and a 'groupBy' object
export function getGroupedChecks(checks, groupBy) {
  if (groupBy === "name" || groupBy === "description") {
    // case A: grouping by 'name' or 'description'
    const groupedChecks = {};
    const groupNames = [];
    checks.forEach((check) => {
      const value = check[groupBy];
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
        if (key === groupBy) {
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
