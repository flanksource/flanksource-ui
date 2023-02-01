import { Modal } from "../Modal";
import { JobHistory } from "./JobsHistoryTable";

type JobsHistoryDetailsProps = {
  job?: JobHistory;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

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
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-4 px-2 py-6">
          {job.details?.errors?.map((error, index) => (
            <div className="block w-full">
              {index + 1}. {error}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
