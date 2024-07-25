import { Age } from "../../../ui/Age";

export const EvidenceLogList = ({ evidence }) => (
  <div className="flex flex-row gap-x-10 border-b py-1.5" key={evidence.id}>
    <div className="flex flex-row">
      <p className="ml-2.5 text-sm font-medium leading-5 text-gray-900">
        <Age from={evidence.created_at} />
      </p>
    </div>
    <p className="truncate text-sm font-medium leading-5">
      {evidence.description}
    </p>
  </div>
);
