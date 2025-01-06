import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
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

  return (
    <>
      <Button
        onClick={() => setIsOpened(true)}
        className="btn-white min-w-max space-x-1"
        title="Run playbook again with the same parameters"
        disabled={isOpened}
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
