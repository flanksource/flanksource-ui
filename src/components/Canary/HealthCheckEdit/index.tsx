import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCanaryCheckItemQuery } from "../../../api/query-hooks";
import { SchemaResourceI } from "../../../api/schemaResources";
import {
  getComponentTemplate,
  getTopology
} from "../../../api/services/topology";
import { HealthCheck } from "../../../api/types/health";
import TextSkeletonLoader from "../../../ui/SkeletonLoader/TextSkeletonLoader";
import { Icon } from "../../Icon";

type HealthCheckEditComponentProps = {
  check: Pick<SchemaResourceI, "source">;
};

function HealthCheckEditComponent({ check }: HealthCheckEditComponentProps) {
  const componentID = check.source?.split("/")[1] || "";

  const { data: template, isLoading } = useQuery(
    ["topology", "component", componentID],
    async () => {
      const res = await getTopology({
        id: componentID
      });
      if (res.components?.[0].topology_id) {
        const system_template_id = res.components?.[0]?.topology_id;
        const template = await getComponentTemplate(system_template_id);
        return template;
      }
      return undefined;
    },
    {
      enabled: componentID !== ""
    }
  );

  if (isLoading) {
    return <TextSkeletonLoader />;
  }

  if (!template) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Link
        to={{
          pathname: `/settings/topologies/${template.id}`
        }}
      >
        {/*  eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="block "> Created by {template.name}</a>
      </Link>
    </div>
  );
}

type HealthCheckEditProps = {
  check: Pick<HealthCheck, "canary_id">;
};

export function HealthCheckEdit({ check }: HealthCheckEditProps) {
  const { isLoading, data: canaryCheck } = useCanaryCheckItemQuery(
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
        <div className="flex items-center px-4 space-x-2">
          <Icon name="k8s" />
          <span>
            CRD linked to {canaryCheck.namespace}/{canaryCheck.name}
          </span>
        </div>
      );
    }

    if (canaryCheck.source.startsWith("component")) {
      return <HealthCheckEditComponent check={canaryCheck} />;
    }
  }

  return (
    <div className="flex items-center px-4 hover:underline">
      <Link
        to={{
          pathname: `/settings/canaries/${check.canary_id}`
        }}
        className="font-semibold cursor-pointer text-blue-500 space-x-2"
      >
        <FaEdit className="inline" size={18} />
        <span>Edit</span>
      </Link>
    </div>
  );
}
