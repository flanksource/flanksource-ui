import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useState } from "react";
import SubmitPlaybookRunForm from "./SubmitPlaybookRunForm";

type ReRunPlaybookWithParamsProps = {
  params?: Record<string, unknown>;
  playbook: Pick<PlaybookSpec, "id" | "spec" | "name">;
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
        className="btn-white min-w-max space-x-2"
        title="Run playbook again with the same parameters"
        disabled={isOpened}
      >
        Re-run playbook
      </Button>

      <SubmitPlaybookRunForm
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        playbook={playbook}
        componentId={componentId}
        checkId={checkId}
        configId={configId}
        params={params}
      />
    </>
  );
}
