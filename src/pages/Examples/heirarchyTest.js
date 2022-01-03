import { NestedHeirarchyBuilder } from "../../components";

export function HeirarchyTestPage() {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center">
      <div className="border mt-12 w-full px-4">
        <NestedHeirarchyBuilder />
      </div>
    </div>
  );
}
