import { FaHourglassStart } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { PiCheckCircleLight, PiWarningLight } from "react-icons/pi";
import {
  PlaybookRunActionStatus,
  PlaybookRunStatus
} from "../../api/types/playbooks";

export const statusIconMap: Record<
  PlaybookRunStatus | PlaybookRunActionStatus,
  React.ReactElement
> = {
  completed: (
    <PiCheckCircleLight className="inline-block h-5 w-auto object-center pr-1 text-green-500" />
  ),
  cancelled: (
    <MdOutlineCancel className="inline-block h-5 w-auto object-center pr-1 text-red-500" />
  ),
  failed: (
    <PiWarningLight className="inline-block h-5 w-auto object-center pr-1 text-red-500" />
  ),
  pending: (
    <FaHourglassStart className="inline-block h-5 w-auto object-center pr-1 text-gray-400" />
  ),
  running: (
    <ImSpinner2 className="inline-block h-5 w-auto object-center pr-1 text-blue-500" />
  ),
  scheduled: (
    <IoCalendarNumberOutline className="inline-block h-5 w-auto object-center pr-1 text-gray-500" />
  ),
  sleeping: (
    <IoCalendarNumberOutline className="inline-block h-5 w-auto object-center pr-1 text-gray-400" />
  ),
  skipped: (
    <MdOutlineCancel className="inline-block h-5 w-auto object-center pr-1 text-red-500" />
  )
};

export type PlaybookRunsStatusProps = {
  status: PlaybookRunActionStatus | PlaybookRunStatus;
};

export function PlaybookStatusIcon({ status }: PlaybookRunsStatusProps) {
  return statusIconMap[status];
}
