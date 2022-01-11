import React from "react";
import { HypothesisBuilder } from "../../components/HypothesisBuilder";

export function HeirarchyTestPage() {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-12 w-full px-4">
        <HypothesisBuilder />
      </div>
    </div>
  );
}
