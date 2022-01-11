import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";

export const badgeMap = {
  0: "Hypothesis",
  1: "Issue",
  2: "Solution"
};

export const hypothesisStates = {
  0: {
    title: "Proven",
    icon: <ThumbUpIcon />,
    color: "#459E45"
  },
  1: {
    title: "Likely",
    icon: <ThumbUpIcon />,
    color: "#AAA526"
  },
  2: {
    title: "Possible",
    icon: <ThumbUpIcon />,
    color: "#808080"
  },
  3: {
    title: "Unlikely",
    icon: <ThumbDownIcon />,
    color: "#808080"
  },
  4: {
    title: "Improbable",
    icon: <ThumbDownIcon />,
    color: "#F59337"
  },
  5: {
    title: "Disproven",
    icon: <ThumbDownIcon />,
    color: "#DD4F4F"
  }
};

export const hypothesisInitialFields = {
  state: null,
  evidences: [],
  links: [],
  comments: []
};

export const addButtonLabels = ["Add issue", "Add potential solution"];
export const textPlaceholders = [
  "Root hypothesis",
  "Issue",
  "Potential solution"
];
