import { Modal } from "../Modal";
import { JobHistory } from "./JobsHistoryTable";
import clsx from "clsx";

type JobsHistoryDetailsProps = {
  job?: JobHistory;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

interface CellProps {
  children: React.ReactNode;
  className?: string;
}

function HCell({ children, className }: CellProps) {
  return <th className={className}>{children}</th>;
}

function Cell({ children, className }: CellProps) {
  return (
    <td className={clsx("px-3 py-3 text-sm border-b", className)}>
      {children}
    </td>
  );
}

export function JobsHistoryDetails({
  job,
  isModalOpen,
  setIsModalOpen
}: JobsHistoryDetailsProps) {
  if (!job || !job.details?.errors) {
    return null;
  }

  return (
    <Modal
      title={`Error details for job ${job.name}`}
      onClose={() => setIsModalOpen(false)}
      open={isModalOpen}
    >
      <div className="max-w-screen-xl mx-auto space-y-6 flex flex-col justify-center">
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <table
            className="table-auto table-fixed w-full relative"
            aria-label="table"
          >
            <thead className={`bg-white sticky top-0 z-01`}>
              <tr>
                <HCell>Error</HCell>
              </tr>
            </thead>
            <tbody>
              {job.details?.errors?.map((error, index) => (
                <tr className="last:border-b-0 border-b cursor-pointer">
                  <Cell className="leading-5 text-gray-900 font-medium">
                    {error}
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
