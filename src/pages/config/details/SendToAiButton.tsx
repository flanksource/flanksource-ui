import { useCallback, useState } from "react";
import { Button } from "@flanksource-ui/components/ui/button";
import { useAiChatPopover } from "@flanksource-ui/components/ai/AiChatPopover";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { Sparkles } from "lucide-react";

type SendToAiButtonProps = {
  configId?: string;
  isLoading?: boolean;
};

export function SendToAiButton({ configId, isLoading }: SendToAiButtonProps) {
  const { setOpen, setChatMessages, setQuickPrompts } = useAiChatPopover();
  const [isSending, setIsSending] = useState(false);
  const disabled = isLoading || isSending || !configId;

  const handleSendToAi = useCallback(async () => {
    if (!configId) {
      return;
    }

    setIsSending(true);
    const quickPrompts = [
      "Summarize this",
      "why is this unhealthy",
      "Recommend ways to improve this"
    ];

    try {
      const url = new URL(
        `/api/llm/context/config/${encodeURIComponent(configId)}`,
        window.location.origin
      );
      const response = await fetch(url.toString(), { method: "GET" });

      if (!response.ok) {
        let message: unknown = `Failed to fetch AI context (${response.status})`;
        try {
          message = await response.json();
        } catch {
          // ignore parsing errors
        }
        toastError(message as any);
        return;
      }

      const json = (await response.json()) as unknown;

      // Safely extract the config type with null/undefined checks
      const configType = (json as any)?.configs?.[0]?.type;
      if (configType) {
        switch (configType) {
          case "Kubernetes::Pod":
            quickPrompts.push(
              "Plot a timeseries for the container memory usage (in MB) of this pod in the last 30 minutes with 1m resolution"
            );
            break;
          case "Kubernetes::Deployment":
            quickPrompts.push(
              "Plot a timeseries for the container memory usage (in MB) of this deployment in the last 30 minutes with 1m resolution"
            );
            break;
        }
      }

      const jsonText =
        typeof json === "string" ? json : JSON.stringify(json, null, 2);
      const text = [
        "Config details and its related configs:",
        "```json",
        jsonText,
        "```"
      ]
        .filter(Boolean)
        .join("\n\n");

      setChatMessages([
        {
          id: `user-${Date.now()}`,
          role: "user",
          parts: [{ type: "text", text }]
        }
      ]);
      setQuickPrompts(quickPrompts);
      setOpen(true);
    } catch (error) {
      toastError(error as any);
    } finally {
      setIsSending(false);
    }
  }, [configId, setChatMessages, setOpen, setQuickPrompts]);

  return (
    <Button
      onClick={handleSendToAi}
      disabled={disabled}
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isSending ? "Sending..." : "Send to AI"}
    </Button>
  );
}
