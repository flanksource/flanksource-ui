import { TbCircleDashedCheck } from "react-icons/tb";
import {
  BsCheckCircle,
  BsCircle,
  BsClock,
  BsHourglassSplit,
  BsSlashCircle,
  BsStopCircle,
  BsXCircle
} from "react-icons/bs";
import {
  PlaybookRunActionStatus,
  PlaybookRunStatus
} from "../../api/types/playbooks";
import { Oval } from "react-loading-icons";

export type PlaybookRunsStatusProps = {
  status: PlaybookRunActionStatus | PlaybookRunStatus;
  animated?: boolean;
};

export function PlaybookStatusIcon({
  status,
  animated = true
}: PlaybookRunsStatusProps) {
  switch (status) {
    case "completed":
      return (
        <BsCheckCircle className="inline h-5 w-auto object-center pr-1 text-green-500" />
      );

    case "cancelled":
      return (
        <BsStopCircle className="inline h-5 w-auto object-center pr-1 text-red-500" />
      );

    case "failed":
      return (
        <BsXCircle className="inline h-5 w-auto object-center pr-1 text-red-500" />
      );

    case "pending_approval":
      return (
        <TbCircleDashedCheck className="inline h-5 w-auto object-center pr-1 text-orange-500" />
      );

    case "waiting":
      return (
        <BsCircle className="inline h-5 w-auto object-center pr-1 text-orange-500" />
      );

    case "running":
      return (
        <Oval
          stroke="#3b82f6"
          opacity={0.8}
          speed={animated ? 1 : 0}
          strokeWidth={5}
          className="inline h-[20px] w-auto object-center py-[1px] pr-1"
        />
      );

    case "scheduled":
      return (
        <BsClock className="inline h-5 w-auto object-center pr-1 text-gray-500" />
      );

    case "sleeping":
      return (
        <BsClock className="inline h-5 w-auto object-center pr-1 text-gray-400" />
      );

    case "skipped":
      return (
        <BsSlashCircle className="inline h-5 w-auto object-center pr-1 text-gray-500" />
      );

    case "timed_out":
      return (
        <BsClock className="inline h-5 w-auto object-center pr-1 text-red-500" />
      );

    case "waiting_children":
      return (
        <BsHourglassSplit className="inline h-5 w-auto object-center pr-1 text-orange-500" />
      );
  }

  return null;
}
