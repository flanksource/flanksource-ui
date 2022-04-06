import { CanaryStandalone } from "../components/CanaryStandalone";

export function CanaryPage({ url = "/canary/api", ...rest }) {
  return (
    <div className="border" {...rest}>
      <CanaryStandalone url={url} topLayoutHeight={0} />
    </div>
  );
}
