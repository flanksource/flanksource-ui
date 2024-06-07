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
    <PiCheckCircleLight className="text-green-500 inline-block object-center  h-5 w-auto pr-1" />
  ),
  cancelled: (
    <MdOutlineCancel className="text-red-500 inline-block object-center  h-5 w-auto pr-1" />
  ),
  failed: (
    <PiWarningLight className="text-red-500 inline-block object-center h-5 w-auto pr-1" />
  ),
  pending: (
    <FaHourglassStart className="text-gray-400 inline-block object-center  h-5 w-auto pr-1" />
  ),
  running: (
    <ImSpinner2 className="text-blue-500 inline-block object-center h-5 w-auto pr-1" />
  ),
  scheduled: (
    <IoCalendarNumberOutline className="text-gray-500 inline-block object-center h-5 w-auto pr-1" />
  ),
  sleeping: (
    <IoCalendarNumberOutline className="text-gray-400 inline-block object-center h-5 w-auto pr-1" />
  ),
  skipped: (
    <MdOutlineCancel className="text-red-500 inline-block object-center  h-5 w-auto pr-1" />
  )
};

export type PlaybookRunsStatusProps = {
  status: PlaybookRunActionStatus | PlaybookRunStatus;
};

export function PlaybookStatusIcon({ status }: PlaybookRunsStatusProps) {
  return statusIconMap[status];
}
