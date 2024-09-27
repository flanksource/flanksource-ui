import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getHealthCheckSummary } from "../../../api/services/topology";
import { HealthCheckSummary } from "../../../api/types/health";
import { Icon } from "../../../ui/Icons/Icon";
import { HealthCheckStatus } from "../../Status/HealthCheckStatus";

type CheckLinkProps = {
  check?: Pick<HealthCheckSummary, "type" | "name" | "id" | "status">;
  checkId?: string;
  className?: string;
};

export function CheckLink({
  check,
  checkId,
  className = "flex w-full flex-row items-center justify-between space-x-2 rounded-md p-2 hover:bg-gray-100"
}: CheckLinkProps) {
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
      className={className}
    >
      <HealthCheckStatus check={data} />
      <Icon name={data.type} className="h-5 w-5" />
      <span className="flex-1 overflow-hidden text-ellipsis">{data.name}</span>
    </Link>
  );
}
