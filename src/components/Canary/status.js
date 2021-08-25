import { Status } from "../Status";

export function StatusList({ check }) {
  if (check.checkStatuses && check.checkStatuses.length >= 1) {
    return (
      <>
        {check.checkStatuses.map((status, idx) => (
          <CanaryStatus
            key={`${check.key}-s${idx}`}
            status={status}
            className="mr-0.5"
          />
        ))}
      </>
    );
  }
  return "";
}

export function CanaryStatus({ status, className }) {
  return <Status state={status.status ? "ok" : "bad"} className={className} />;
}
