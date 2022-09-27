import dayjs from "dayjs";

export const EvidenceLogList = ({ evidence }) => (
  <div className="flex flex-row gap-x-10 py-1.5 border-b" key={evidence.id}>
    <div className="flex flex-row">
      <p className="ml-2.5 text-sm leading-5 font-medium text-gray-900">
        {dayjs(evidence.created_at).format("MMM DD, YYYY HH:mm.ss.SSS")}
      </p>
    </div>
    <p className="text-sm leading-5 font-medium truncate">
      {evidence.description}
    </p>
  </div>
);
