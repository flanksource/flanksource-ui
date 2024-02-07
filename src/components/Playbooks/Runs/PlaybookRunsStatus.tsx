import {
  PlaybookRunsStatusProps,
  PlaybookStatusIcon
} from "../../Icon/PlaybookStatusIcon";

export function PlaybookStatusDescription({ status }: PlaybookRunsStatusProps) {
  return (
    <div className="flex flex-row items-center gap-1">
      <PlaybookStatusIcon status={status} />
      <span className="capitalize">{status}</span>
    </div>
  );
}
