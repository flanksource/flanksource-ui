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
    <div className="flex flex-row space-x-2">
      <div>Passed: {uptime.passed}</div>
      <div>Failed: {uptime.failed}</div>
    </div>
  );
}
