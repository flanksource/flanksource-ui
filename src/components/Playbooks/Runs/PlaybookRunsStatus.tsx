import { BsFillExclamationCircleFill } from "react-icons/bs";
import { FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa";
import { PlaybookRunStatus } from "../../../api/types/playbooks";

const statusIconMap: Record<PlaybookRunStatus, { icon: React.ReactNode }> = {
  completed: {
    icon: <FaCheckCircle className="text-green-500" />
  },
  cancelled: {
    icon: <BsFillExclamationCircleFill className="text-yellow-500" />
  },
  failed: {
    icon: <BsFillExclamationCircleFill className="text-red-500" />
  },
  pending: {
    icon: <FaCheckCircle className="text-gray-500" />
  },
  running: {
    icon: <FaSpinner className="text-yellow-500" />
  },
  scheduled: {
    icon: <FaClock className="text-gray-500" />
  }
};

type PlaybookRunsStatusProps = {
  status: PlaybookRunStatus;
  className?: string;
  hideStatusLabel?: boolean;
};

export default function PlaybookRunsStatus({
  status,
  className = "capitalize",
  hideStatusLabel = false
}: PlaybookRunsStatusProps) {
  const { icon } = statusIconMap[status];

  return (
    <div className={`flex items-center ${className}`}>
      {icon}
      {!hideStatusLabel && <span className="ml-2">{status}</span>}
    </div>
  );
}
