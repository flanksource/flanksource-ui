import {
  PlaybookRunsStatusProps,
  PlaybookStatusIcon
} from "@flanksource-ui/ui/Icons/PlaybookStatusIcon";

const formatStatus = (status: string): string => {
  switch (status) {
    case "timed_out":
      return "Timed Out";
    case "pending_approval":
      return "Pending Approval";
    default:
      return status;
  }
};

export function PlaybookStatusDescription({ status }: PlaybookRunsStatusProps) {
  return (
    <div className="flex flex-row items-center gap-1 pl-1">
      <PlaybookStatusIcon status={status} />
      <span className="capitalize">{formatStatus(status)}</span>
    </div>
  );
}
