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
      <div className="flex flex-row pb-1 pl-2 text-sm">
        <IncidentTypeIcon type={incident.type as keyof typeof typeItems} />
        <Link
          className="mx-1 block cursor-pointer text-xs"
          to={{
            pathname: `/incidents/${incident.id}`
          }}
        >
          {incident.title}
        </Link>
        <IncidentStatusTag status={incident.status!} className="ml-1" />
        <div className="grow text-right">
          <Age from={incident.created_at} />
        </div>
      </div>
    </div>
  );
}
