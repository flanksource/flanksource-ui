import { useCallback } from "react";
import { type PlaybookRunWithActions } from "@flanksource-ui/api/types/playbooks";
import { useAiChatPopover } from "@flanksource-ui/components/ai/AiChatPopover";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Sparkles } from "lucide-react";

type DiagnosePlaybookFailureButtonProps = {
  data: PlaybookRunWithActions;
};

export function DiagnosePlaybookFailureButton({
  data
}: DiagnosePlaybookFailureButtonProps) {
  const { setOpen, setChatMessages } = useAiChatPopover();

  const handleDiagnoseFailure = useCallback(() => {
    const systemPrompt = `You are helping diagnose why a Playbook run failed in Mission Control.

Context on Playbooks:
- A Playbook is an automated workflow that executes a sequence of Actions
- Each Action in the playbook has a status (scheduled, running, completed, failed, skipped, etc.)
- A PlaybookRun is an instance/execution of a Playbook
- PlaybookRuns can have parameters and child runs

When analyzing a failed run:
1. Check the overall run status and error message
2. Identify which actions failed and their error details
3. Look at action results to understand what went wrong
4. Consider the parameters that were passed in
5. Look at the playbook spec to understand the intended flow
6. Suggest specific fixes based on the error

Be concise and actionable in your diagnosis.`;

    const failedActions =
      data.actions?.filter((a) => a.status === "failed") || [];
    const userPrompt = `Please diagnose why this playbook run failed.${
      data.error ? ` Run error: ${data.error}` : ""
    }${
      failedActions.length > 0
        ? ` ${failedActions.length} action(s) failed.`
        : ""
    } What went wrong and how do we fix it?`;

    const text = JSON.stringify(data, null, 2);

    setChatMessages([
      {
        id: `system-${Date.now()}`,
        role: "system",
        parts: [{ type: "text", text: systemPrompt }]
      },
      {
        id: `user-${Date.now()}`,
        role: "user",
        parts: [
          {
            type: "text",
            text: `${userPrompt}\n\nPlaybook Run Data:\n\`\`\`json\n${text}\n\`\`\``
          }
        ]
      }
    ]);

    setOpen(true);
  }, [data, setChatMessages, setOpen]);

  return (
    <Button
      onClick={handleDiagnoseFailure}
      className="btn-white min-w-max space-x-1"
      title="Diagnose playbook failure with AI"
    >
      <Sparkles className="h-5 w-5" />
      <span>Diagnose Failure</span>
    </Button>
  );
}
