import Canary from "../../components/Canary";
import checks from "../../data/a.real.json";

export default function CanaryPage() {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-6xl">
        <Canary checks={checks.checks} />
      </div>
    </div>
  );
}
