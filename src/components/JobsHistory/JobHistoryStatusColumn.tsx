import { useMemo } from "react";
import { JobHistoryStatus, classNameMaps } from "./JobsHistoryTable";
import { FaDotCircle } from "react-icons/fa";

type Props = {
  status?: JobHistoryStatus;
};

export default function JobHistoryStatusColumn({ status }: Props) {
  const className = useMemo(() => {
    if (status) {
      return classNameMaps.get(status);
    }
  }, [status]);

  if (!status) {
    return null;
  }

  return (
    <>
      <FaDotCircle className={`inline ${className}`} />
      <span className="ml-1">{status}</span>
    </>
  );
}
