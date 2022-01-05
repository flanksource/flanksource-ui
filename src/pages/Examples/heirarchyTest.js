import React, { useState } from "react";
import { NestedHeirarchy } from "../../components/NestedHeirarchy";
import { HypothesisNode } from "../../components/NestedHeirarchy/HypothesisNode";

export function HeirarchyTestPage() {
  const [tree, setTree] = useState({
    id: "",
    description: "",
    icon: null,
    children: []
  });

  return (
    <div className="max-w-screen-xl mx-auto flex justify-center">
      <div className="mt-12 w-full px-4">
        <NestedHeirarchy tree={tree} setTree={setTree} depthLimit={2}>
          <HypothesisNode />
        </NestedHeirarchy>
      </div>
    </div>
  );
}
