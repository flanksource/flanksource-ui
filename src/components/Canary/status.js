import { Status } from "../Status";

export function StatusList({ check, checkStatuses }) {
  if (check && check.checkStatuses && check.checkStatuses.length > 0) {
    return (
      <>
        {check.checkStatuses.map((status) => (
          <CanaryStatus key={status.id} status={status} className="mr-0.5" />
        ))}
      </>
    );
  }
  if (checkStatuses && checkStatuses.length > 0) {
    return (
      <>
        {checkStatuses.map((status) => (
          <CanaryStatus key={status.id} status={status} className="mr-0.5" />
        ))}
      </>
    );
  }
  return "";
}



export function CanaryStatus({ status, className }) {
  if (status.mixed) {
    return <Status mixed={status.mixed} className={className} />;
  }
  return <Status good={status.status} className={className} />;
}
