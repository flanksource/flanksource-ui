import { Canary } from "../components/Canary";

export function CanaryPage({ url = "/api/canary/api", ...rest }) {
  return (
    <div className="border" {...rest}>
      <Canary url={url} />
    </div>
  );
}
