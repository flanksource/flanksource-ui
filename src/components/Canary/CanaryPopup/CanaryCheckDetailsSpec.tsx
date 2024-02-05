import { useMemo } from "react";
import { HealthCheck } from "../../../api/types/health";
import { JSONViewer } from "../../../ui/JSONViewer";

type CanaryCheckDetailsProps = {
  check: Pick<Partial<HealthCheck>, "canary_id" | "spec">;
};

export function CanaryCheckDetailsSpecTab({ check }: CanaryCheckDetailsProps) {
  const code = useMemo(() => {
    if (!check?.spec) {
      return null;
    }
    return JSON.stringify(check.spec, null, 2);
  }, [check?.spec]);

  return (
    <div key="specs">
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
