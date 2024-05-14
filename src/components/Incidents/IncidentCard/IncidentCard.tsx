import clsx from "clsx";
import { Link } from "react-router-dom";
import { Incident } from "../../../api/types/incident";
import { Age } from "../../../ui/Age";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { typeItems } from "../data";
import { IncidentTypeIcon } from "../incidentTypeTag";

type IncidentCardProps = {
  incident: Incident;
} & React.HTMLProps<HTMLDivElement>;

export default function IncidentCard({
  incident,
  className,
  ...props
}: IncidentCardProps) {
  return (
    <div className={clsx("border-b border-dashed", className)} {...props}>
      <div className="flex flex-row text-sm pl-2 pb-1">
        <IncidentTypeIcon type={incident.type as keyof typeof typeItems} />
        <Link
          className="block text-xs mx-1 cursor-pointer"
          to={{
            pathname: `/incidents/${incident.id}`
          }}
        >
          {incident.title}
        </Link>
        <IncidentStatusTag status={incident.status!} className="ml-1" />
        <div className="text-right grow">
          <Age from={incident.created_at} />
        </div>
      </div>
    </div>
  );
}
