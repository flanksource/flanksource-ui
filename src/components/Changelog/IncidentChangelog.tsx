/* This example requires Tailwind CSS v2.0+ */
import { useQuery } from "@tanstack/react-query";
import {
  getIncidentHistory,
  IncidentHistoryType
} from "../../api/services/IncidentsHistory";
import { Loading } from "../Loading";
import { relativeDateTime } from "../../utils/date";
import { Avatar } from "../Avatar";

const IncidentHistoryTypes: Record<IncidentHistoryType, Record<string, any>> = {
  "evidence.created": { text: "Evidence Created" },
  "incident.created": { text: "Incident Created" },
  "responder.created": { text: "Responder Created" },
  "incident_status.updated": { text: "Incident Status Updated" }
};

type ChangelogProps = {
  incidentId: string;
};

export function IncidentChangelog({ incidentId }: ChangelogProps) {
  const { data: incidentHistory, isLoading } = useQuery(
    ["incident_histories", incidentId],
    () => getIncidentHistory(incidentId)
  );

  return (
    <div className="bg-white">
      <div className="flex justify-between py-4 border-b border-gray-200 mb-4">
        <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray px-4">
          Changelog
        </h2>
      </div>
      {isLoading ? (
        <Loading text="Loading ..." />
      ) : incidentHistory && incidentHistory.length > 0 ? (
        <ul className="px-4">
          {incidentHistory.map((history) => (
            <li key={history.id}>
              <div className="pb-4">
                <div className="flex space-x-3">
                  <Avatar user={history.created_by} size="md" />
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-gray-500">
                        {IncidentHistoryTypes[history.type].text}
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap text-gray-500">
                      <time dateTime={history.created_at}>
                        {relativeDateTime(history.created_at)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-4">
          <p className="text-gray-500">No changelog found</p>
        </div>
      )}
    </div>
  );
}
