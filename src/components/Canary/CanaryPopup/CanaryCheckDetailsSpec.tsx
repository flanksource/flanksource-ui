import { HealthCheck } from "@flanksource-ui/api/types/health";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { useHealthCheckSpecQuery } from "@flanksource-ui/api/query-hooks";
import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { useMemo } from "react";

type CanaryCheckDetailsProps = {
  check: Pick<Partial<HealthCheck>, "canary_id">;
};

export function CanaryCheckDetailsSpecTab({ check }: CanaryCheckDetailsProps) {
  const { isLoading, data: canaryCheck } = useHealthCheckSpecQuery(
    check.canary_id!,
    {
      enabled: check.canary_id !== undefined
    }
  );

  const code = useMemo(() => {
    if (!canaryCheck?.spec) {
      return null;
    }
    return JSON.stringify(canaryCheck.spec, null, 2);
  }, [canaryCheck?.spec]);

  if (isLoading) {
    return <FormSkeletonLoader />;
  }

  return (
    <div key="specs" className="flex min-h-0 flex-1 flex-col">
      <JSONViewer
        code={code ?? ""}
        format={"json"}
        showLineNo
        convertToYaml
        fillHeight
        // onClick={handleClick}
        // selections={checked}
      />
    </div>
  );
}
