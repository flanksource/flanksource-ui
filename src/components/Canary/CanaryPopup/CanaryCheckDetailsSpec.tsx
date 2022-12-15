import { useMemo } from "react";
import { useCanaryCheckItemQuery } from "../../../api/query-hooks";
import { HealthCheck } from "../../../types/healthChecks";
import { JSONViewer } from "../../JSONViewer";
import { Loading } from "../../Loading";

type CanaryCheckDetailsProps = {
  check: Pick<Partial<HealthCheck>, "canary_id">;
};

export function CanaryCheckDetailsSpecTab({ check }: CanaryCheckDetailsProps) {
  const { isLoading, data: canaryCheck } = useCanaryCheckItemQuery(
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
    return <Loading text="Loading ..." />;
  }

  return (
    <div key="specs" className="px-6 py-6">
      <JSONViewer
        code={code ?? ""}
        format={"json"}
        showLineNo
        convertToYaml
        // onClick={handleClick}
        // selections={checked}
      />
    </div>
  );
}
