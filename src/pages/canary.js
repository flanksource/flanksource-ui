import { Canary } from "../components/Canary";

export function CanaryPage({ url = "/api" }) {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-center">
      <Canary url={url} />
    </div>
  );
}
