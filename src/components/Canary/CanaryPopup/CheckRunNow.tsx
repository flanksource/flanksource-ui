import {
  HealthCheckRunNowResponse,
  runHealthCheckNow
} from "@flanksource-ui/api/services/topology";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useRecordTouchpoint } from "@flanksource-ui/components/GuidedTour/useTouchpoints";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { VscDebugRerun } from "react-icons/vsc";

type Props = {
  check: Pick<HealthCheck, "id" | "name">;
  onSuccessfulRun?: (run: HealthCheckRunNowResponse) => void;
};

export default function CheckRunNow({
  check,
  onSuccessfulRun = () => {}
}: Props) {
  const recordTouchpoint = useRecordTouchpoint();

  const { isLoading, mutate: runNow } = useMutation({
    mutationFn: runHealthCheckNow,
    onSuccess: (data) => {
      onSuccessfulRun(data.data);
    }
  });

  if (!check.id) {
    return null;
  }

  return (
    <AuthorizationAccessCheck resource={tables.canaries} action="create">
      <div
        data-tour="check-run-now"
        className="flex flex-col items-center justify-center"
      >
        <Button
          className="btn-white"
          text="Run Now"
          icon={
            !isLoading ? (
              <VscDebugRerun />
            ) : (
              <FaSpinner className="animate-spin" />
            )
          }
          onClick={() => {
            recordTouchpoint("health.run-now");
            runNow(check.id);
          }}
        />
      </div>
    </AuthorizationAccessCheck>
  );
}
