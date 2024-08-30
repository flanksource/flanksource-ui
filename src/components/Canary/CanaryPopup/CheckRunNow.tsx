import {
  HealthCheckRunNowResponse,
  runHealthCheckNow
} from "@flanksource-ui/api/services/topology";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { VscDebugRerun } from "react-icons/vsc";

// admin, editor, responder, commander roles are allowed to run checks
const allowedRoles = ["admin", "editor", "responder", "commander"];

type Props = {
  check: Pick<HealthCheck, "id" | "name">;
  onSuccessfulRun?: (run: HealthCheckRunNowResponse) => void;
};

export default function CheckRunNow({
  check,
  onSuccessfulRun = () => {}
}: Props) {
  const { roles } = useUserAccessStateContext();

  const { isLoading, mutate: runNow } = useMutation({
    mutationFn: runHealthCheckNow,
    onSuccess: (data) => {
      onSuccessfulRun(data.data);
    }
  });

  const canRun = roles.some((role) => allowedRoles.includes(role));

  if (!canRun || !check.id) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center">
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
          runNow(check.id);
        }}
      />
    </div>
  );
}
