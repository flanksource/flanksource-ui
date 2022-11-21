import { Link } from "react-router-dom";
import { Incident } from "../../api/services/incident";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { IncidentTypeIcon } from "../incidentTypeTag";

import dayjs from "dayjs";

type IncidentCardProps = {
  incident: Incident;
};

export default function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <div className=" border-b border-dashed">
      <div className="flex flex-row  text-xs pl-2 pb-1">
        <IncidentTypeIcon type={incident.type} />

        <Link
          className="block"
          to={{
            pathname: `/incidents/${incident.id}`
          }}
        >
          <span>{incident.title}</span>
        </Link>
        <IncidentStatusTag
          status={incident.status!}
          size="sm"
          className="ml-1"
        />
        <div className="text-right grow">
          {dayjs(incident.created_at).fromNow()}
        </div>
      </div>
    </div>
  );
}
