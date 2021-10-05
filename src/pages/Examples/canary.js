import { Canary } from "../../components/Canary";
import data from "../../data/sample.real.json";

export function CanaryPage() {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center">
      <Canary checks={data.checks} />
    </div>
  );
}
