import { useCallback } from "react";
import dayjs from "dayjs";
import { type PlaybookRunWithActions } from "@flanksource-ui/api/types/playbooks";
import { useAiChatPopover } from "@flanksource-ui/components/ai/AiChatPopover";
import { Button } from "@flanksource-ui/components/ui/button";
import { truncateText } from "@flanksource-ui/utils/common";
import { formatDuration } from "@flanksource-ui/utils/date";
import { Sparkles } from "lucide-react";

type DiagnosePlaybookFailureButtonProps = {
  data: PlaybookRunWithActions;
};

const SPEC_MAX_CHARS = 5000;
const ACTION_RESULT_MAX_CHARS = 10000;

export function DiagnosePlaybookFailureButton({
  data
}: DiagnosePlaybookFailureButtonProps) {
  const { setOpen, setChatMessages, setQuickPrompts } = useAiChatPopover();

  const handleDiagnoseFailure = useCallback(() => {
    const playbookName =
      data.playbooks?.title || data.playbooks?.name || "Unknown";

    const parametersText =
      data.parameters == null
        ? "None"
        : JSON.stringify(data.parameters, null, 2);
    const parametersSection =
      parametersText === "None"
        ? parametersText
        : ["```json", parametersText, "```"].join("\n");

    const specText = truncateText(
      JSON.stringify(data.spec, null, 2),
      SPEC_MAX_CHARS
    );

    const duration =
      data.start_time && data.end_time
        ? formatDuration(dayjs(data.end_time).diff(dayjs(data.start_time)))
        : "Unknown";

    const actionsSection = data.actions?.length
      ? data.actions
          .map((action, index) => {
            const actionResultText =
              action.result == null
                ? "None"
                : truncateText(
                    JSON.stringify(action.result, null, 2),
                    ACTION_RESULT_MAX_CHARS
                  );

            const actionResultSection =
              actionResultText === "None"
                ? actionResultText
                : ["```json", actionResultText, "```"].join("\n");

            return [
              `### Action ${index + 1}: ${action.name || "Unknown"}`,
              `- **Status**: ${action.status}`,
              `- **Error**: ${action.error || "None"}`,
              "- **Result**:",
              actionResultSection
            ].join("\n");
          })
          .join("\n\n")
      : "No actions recorded.";

    const text = [
      "# Diagnose Playbook Failure",
      `- **Playbook**: ${playbookName}`,
      `- **Status**: ${data.status}`,
      `- **Error**: ${data.error || "N/A"}`,
      `- **Start Time**: ${data.start_time || "Unknown"}`,
      `- **Duration**: ${duration}`,
      "",
      "## Parameters",
      parametersSection,
      "",
      "## Spec",
      "```json",
      specText,
      "```",
      "",
      "## Actions",
      actionsSection
    ].join("\n");

    setChatMessages([
      {
        id: `user-${Date.now()}`,
        role: "user",
        parts: [{ type: "text", text }]
      }
    ]);

    setQuickPrompts([
      "Why did this playbook fail?",
      "How can I fix this error?",
      "Explain each failed action's output"
    ]);

    setOpen(true);
  }, [data, setChatMessages, setOpen, setQuickPrompts]);

  return (
    <Button
      onClick={handleDiagnoseFailure}
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4" />
      Diagnose Failure
    </Button>
  );
}
