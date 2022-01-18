import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";

export const badgeMap = {
  0: "Hypothesis",
  1: "Issue",
  2: "Solution"
};

export const hypothesisStatuses = {
  0: {
    title: "Proven",
    value: "proven",
    icon: <ThumbUpIcon />,
    color: "#459E45"
  },
  1: {
    title: "Likely",
    value: "likely",
    icon: <ThumbUpIcon />,
    color: "#AAA526"
  },
  2: {
    title: "Possible",
    value: "possible",
    icon: <ThumbUpIcon />,
    color: "#808080"
  },
  3: {
    title: "Unlikely",
    value: "unlikely",
    icon: <ThumbDownIcon />,
    color: "#808080"
  },
  4: {
    title: "Improbable",
    value: "improbable",
    icon: <ThumbDownIcon />,
    color: "#F59337"
  },
  5: {
    title: "Disproven",
    value: "disproven",
    icon: <ThumbDownIcon />,
    color: "#DD4F4F"
  }
};

export const hypothesisInitialFields = {
  status: null,
  evidence: [],
  links: [],
  comments: []
};

export const addButtonLabels = ["Add issue", "Add potential solution"];
export const textPlaceholders = [
  "Root hypothesis",
  "Issue",
  "Potential solution"
];
