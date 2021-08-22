import Canary from "../../components/Canary";
export default function CanaryPage() {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center">
      <Canary url="http://localhost:8080/api" />
    </div>
  );
}
