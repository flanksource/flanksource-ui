import trace from "./trace.png";
import { SearchLayout } from "../Layout";

export function TraceView() {
  return (
    <SearchLayout title={<>Traces</>}>
      <div className="max-w-5xl mx-auto">
        <img alt="traces" src={trace} className="pl-50 pr-50" />
      </div>
    </SearchLayout>
  );
}
