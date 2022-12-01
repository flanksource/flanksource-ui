import { HealthCheckUptime } from "../../../types/healthChecks";

type CanaryCheckDetailsUptimeProps = {
  uptime?: HealthCheckUptime;
};

export default function CanaryCheckDetailsUptime({
  uptime
}: CanaryCheckDetailsUptimeProps) {
  if (!uptime) {
    return <>-</>;
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">Passed: {uptime.passed}</div>
      <div className="flex flex-row">Failed: {uptime.failed}</div>
    </div>
  );
}
