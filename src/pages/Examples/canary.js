import Canary from "../../components/Canary";

export default function CanaryPage() {
  return (
    <div className="w-full flex justify-center">
      <Canary url="http://localhost:8080/api" />
    </div>
  );
}
