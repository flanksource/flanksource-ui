import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getHealthCheckSummary } from "../../../api/services/topology";
import { HealthCheckSummary } from "../../../api/types/health";
import { Icon } from "../../../ui/Icons/Icon";
import { HealthCheckStatus } from "../../Status/HealthCheckStatus";

type CheckLinkProps = {
  check?: Pick<HealthCheckSummary, "type" | "name" | "id" | "status">;
  checkId?: string;
};

export function CheckLink({ check, checkId }: CheckLinkProps) {
  const { data } = useQuery(["check", checkId, check], () => {
    if (check) {
      return check;
    }
    if (checkId != null) {
      return getHealthCheckSummary(checkId);
    }
    return null;
  });

  if (data == null) {
    return null;
  }

  return (
    <Link
      role="link"
      to={{
        pathname: `/health`,
        search: `?checkId=${data.id}&timeRange=1h`
      }}
      className={`flex flex-row justify-between w-full items-center space-x-2 p-2 rounded-md hover:bg-gray-100`}
    >
      <div className="flex flex-row gap-2 w-full items-center">
        <div className="flex flex-row space-x-1 items-center flex-1text-sm ">
          <HealthCheckStatus check={data} />
          <Icon name={data.type} className="w-4 h-auto" />
          <div className="overflow-hidden text-ellipsis flex-1">
            {data.name}
          </div>
        </div>
      </div>
    </Link>
  );
}
