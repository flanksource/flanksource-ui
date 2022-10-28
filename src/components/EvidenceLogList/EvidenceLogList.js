import { DATE_FORMATS, formatDate } from "../../utils/date";

export const EvidenceLogList = ({ evidence }) => (
  <div className="flex flex-row gap-x-10 py-1.5 border-b" key={evidence.id}>
    <div className="flex flex-row">
      <p className="ml-2.5 text-sm leading-5 font-medium text-gray-900">
        {formatDate(evidence.created_at, { stringFormat: DATE_FORMATS.LONG })}
      </p>
    </div>
    <p className="text-sm leading-5 font-medium truncate">
      {evidence.description}
    </p>
  </div>
);
