import Status from "../Status";
export default function StatusList({ check }) {
  if (check.checkStatuses == null) {
    return "";
  }
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

export function CanaryStatus({ status, className }) {
  return <Status state={status.status ? "ok" : "bad"} className={className} />;
}
