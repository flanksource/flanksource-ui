import React from "react";
import { NestedHeirarchyBuilder } from "../../components";

export function HeirarchyTestPage() {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center">
      <div className="mt-12 w-full px-4">
        <NestedHeirarchyBuilder showJSON />
      </div>
    </div>
  );
}
