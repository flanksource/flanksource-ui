import { useHealthCheckSpecQuery } from "@flanksource-ui/api/query-hooks";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CatalogResourceSource } from "../Settings/CatalogResourceSource";
import ComponentResourceSource from "../Settings/ComponentResourceSource";

type HealthCheckEditProps = {
  check: Pick<HealthCheck, "canary_id">;
};

export function HealthCheckEdit({ check }: HealthCheckEditProps) {
  const { isLoading, data: canaryCheck } = useHealthCheckSpecQuery(
    check.canary_id!,
    {
      enabled: check.canary_id !== undefined
    }
  );

  if (!canaryCheck || isLoading) {
    return null;
  }

  if (canaryCheck.source) {
    if (canaryCheck.source.startsWith("kubernetes")) {
      return (
        <CRDSource
          id={canaryCheck.id}
          name={canaryCheck.name}
          namespace={canaryCheck.namespace}
          source={canaryCheck.source}
        />
      );
    }

    if (canaryCheck.source.startsWith("component")) {
      return <ComponentResourceSource source={canaryCheck.source} />;
    }

    if (canaryCheck.source.startsWith("kubernetes")) {
      return <CatalogResourceSource source={canaryCheck.source} />;
    }
  }

  return (
    <div className="flex items-center px-4 hover:underline">
      <Link
        to={{
          pathname: `/settings/canaries/${check.canary_id}`
        }}
        className="cursor-pointer space-x-2 font-semibold text-blue-500"
      >
        <FaEdit className="inline" size={18} />
        <span>Edit</span>
      </Link>
    </div>
  );
}
