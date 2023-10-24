import { Link } from "react-router-dom";
import { ComponentHealthCheckView } from "../../api/services/topology";
import { HealthCheck } from "../../api/types/health";
import { Icon } from "../Icon";
import { HealthCheckStatus } from "../Status/HealthCheckStatus";

type ComponentCheckLinkProps = {
  componentCheck: ComponentHealthCheckView;
};

export function CheckLink({ componentCheck: check }: ComponentCheckLinkProps) {
  return (
    <Link
      to={{
        pathname: `/health`,
        search: `?checkId=${check.id}&timeRange=1h`
      }}
      className={`flex flex-row justify-between w-full items-center space-x-2 p-2 rounded-md hover:bg-gray-100`}
    >
      <div className="flex flex-row gap-2 w-full items-center">
        <div className="flex flex-row space-x-1 items-center flex-1text-sm ">
          <HealthCheckStatus check={check as Pick<HealthCheck, "status">} />
          <Icon name={check.type} className="w-4 h-auto" />
          <div className="overflow-hidden text-ellipsis flex-1">
            {check.name}
          </div>
        </div>
      </div>
    </Link>
  );
}
