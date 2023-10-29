import {
  PlaybookRunsStatusProps,
  PlaybookStatusIcon
} from "../../Icon/PlaybookStatusIcon";

export function PlaybookStatusDescription({ status }: PlaybookRunsStatusProps) {
  return (
    <div>
      <PlaybookStatusIcon status={status} />
      <span className="capitalize">{status}</span>
    </div>
  );
}
