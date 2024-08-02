import {
  BsCheckCircle,
  BsCircle,
  BsClock,
  BsPlayCircle,
  BsSlashCircle,
  BsStopCircle,
  BsXCircle
} from "react-icons/bs";
import {
  PlaybookRunActionStatus,
  PlaybookRunStatus
} from "../../api/types/playbooks";

export const statusIconMap: Record<
  PlaybookRunStatus | PlaybookRunActionStatus,
  React.ReactElement
> = {
  completed: (
    <BsCheckCircle className="inline-block h-5 w-auto object-center pr-1 text-green-500" />
  ),
  cancelled: (
    <BsStopCircle className="inline-block h-5 w-auto object-center pr-1 text-red-500" />
  ),
  failed: (
    <BsXCircle className="inline-block h-5 w-auto object-center pr-1 text-red-500" />
  ),
  pending: (
    <BsCircle className="inline-block h-5 w-auto object-center pr-1 text-orange-500" />
  ),
  running: (
    <BsPlayCircle className="inline-block h-5 w-auto object-center pr-1 text-orange-500" />
  ),
  scheduled: (
    <BsClock className="inline-block h-5 w-auto object-center pr-1 text-gray-500" />
  ),
  sleeping: (
    <BsClock className="inline-block h-5 w-auto object-center pr-1 text-gray-400" />
  ),
  skipped: (
    <BsSlashCircle className="inline-block h-5 w-auto object-center pr-1 text-gray-500" />
  )
};

export type PlaybookRunsStatusProps = {
  status: PlaybookRunActionStatus | PlaybookRunStatus;
};

export function PlaybookStatusIcon({ status }: PlaybookRunsStatusProps) {
  return statusIconMap[status];
}
