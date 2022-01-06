import React from "react";

export function HypothesisDetails({ node, tree, setTree, ...rest }) {
  return (
    <div className={`p-4 ${rest.className || ""}`} {...rest}>
      {node.description}
    </div>
  );
}
