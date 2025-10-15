import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { useUser } from "@flanksource-ui/context";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { hasPlaybookRunPermission } from "@flanksource-ui/utils/playbookPermissions";
import { useState } from "react";
import { VscDebugRerun } from "react-icons/vsc";
import SubmitPlaybookRunForm from "./SubmitPlaybookRunForm";

type ReRunPlaybookWithParamsProps = {
  params?: Record<string, unknown>;
  playbook: Pick<PlaybookSpec, "id" | "spec" | "name" | "title">;
  componentId?: string;
  configId?: string;
  checkId?: string;
};

export default function ReRunPlaybookWithParamsButton({
  params,
  playbook,
  componentId,
  configId,
  checkId
}: ReRunPlaybookWithParamsProps) {
  const [isOpened, setIsOpened] = useState(false);
  const { permissions, roles } = useUser();
  const isAdminOrEditor = roles.includes("admin") || roles.includes("editor");
  const canRunPlaybooks =
    isAdminOrEditor || hasPlaybookRunPermission(permissions);

  return (
    <>
      <Button
        onClick={() => setIsOpened(true)}
        className="btn-white min-w-max space-x-1"
        title="Run playbook again with the same parameters"
        disabled={isOpened || !canRunPlaybooks}
        disabledTooltip={
          !canRunPlaybooks
            ? "You don't have permission to run playbooks"
            : undefined
        }
      >
        <VscDebugRerun className="h-5 w-5" />
        <span>Rerun Playbook</span>
      </Button>

      <SubmitPlaybookRunForm
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        playbook={playbook}
        componentId={componentId}
        checkId={checkId}
        configId={configId}
        params={params}
        overrideParams
      />
    </>
  );
}
