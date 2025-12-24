import { Chat, useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from "@flanksource-ui/components/ai-elements/conversation";
import { SquarePen, X } from "lucide-react";
import { Loader } from "@flanksource-ui/components/ai-elements/loader";
import {
  Confirmation,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRequest,
  ConfirmationTitle
} from "@flanksource-ui/components/ai-elements/confirmation";
import {
  Message,
  MessageContent,
  MessageResponse
} from "@flanksource-ui/components/ai-elements/message";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput
} from "@flanksource-ui/components/ai-elements/tool";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools
} from "@flanksource-ui/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger
} from "@flanksource-ui/components/ai-elements/reasoning";
import {
  Suggestion,
  Suggestions
} from "@flanksource-ui/components/ai-elements/suggestion";
import { Button } from "@flanksource-ui/components/ui/button";
import { Card } from "@flanksource-ui/components/ui/card";
import { cn } from "@flanksource-ui/lib/utils";
import type { FileUIPart, ReasoningUIPart, UIMessage } from "ai";
import { getToolName, isToolUIPart } from "ai";
import { useCallback } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function AddAttachmentButton() {
  return (
    <PromptInputButton
      aria-label="Add attachment"
      size="icon-sm"
      type="button"
      variant="ghost"
    />
  );
}

type TimeseriesPoint = { timestamp: string; value: number };
type PlotTimeseriesOutput = {
  kind: "plot_timeseries";
  timeseries: TimeseriesPoint[];
  title?: string;
};

const isPlotTimeseriesOutput = (
  output: unknown
): output is PlotTimeseriesOutput => {
  if (!output || typeof output !== "object") {
    return false;
  }

  const candidate = output as Partial<PlotTimeseriesOutput>;

  if (
    candidate.kind !== "plot_timeseries" ||
    !Array.isArray(candidate.timeseries)
  ) {
    return false;
  }

  return candidate.timeseries.every(
    (point) =>
      point &&
      typeof point === "object" &&
      typeof (point as TimeseriesPoint).timestamp === "string" &&
      typeof (point as TimeseriesPoint).value === "number"
  );
};

function PlotTimeseriesChart({ output }: { output: PlotTimeseriesOutput }) {
  const data = [...output.timeseries]
    .map((point) => ({
      ...point,
      date: new Date(point.timestamp),
      label: new Date(point.timestamp).toLocaleString()
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-2 p-4">
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {output.title ?? "Timeseries Chart"}
      </h4>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tickMargin={8} minTickGap={16} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export type AIChatProps = {
  className?: string;
  chat: Chat<UIMessage>;
  id?: string;
  onClose?: () => void;
  onNewChat?: () => void;
  quickPrompts?: string[];
};

export function AIChat({
  chat,
  className,
  id,
  onClose,
  onNewChat,
  quickPrompts
}: AIChatProps) {
  const {
    messages,
    sendMessage,
    stop,
    status,
    addToolApprovalResponse,
    setMessages
  } = useChat({
    chat,
    id
  });

  const handleToolApproval = useCallback(
    async (approvalId: string, approved: boolean) => {
      await addToolApprovalResponse({
        id: approvalId,
        approved,
        ...(approved ? {} : { reason: "denied by user" })
      });

      const isWaitingForFollowUp =
        status !== "streaming" && status !== "submitted";
      if (isWaitingForFollowUp) {
        await sendMessage();
      }
    },
    [addToolApprovalResponse, sendMessage, status]
  );

  const handleSubmit = useCallback(
    async ({ text, files }: { text: string; files: FileUIPart[] }) => {
      const trimmed = text.trim();
      if (!trimmed && files.length === 0) {
        return;
      }

      await sendMessage({
        text: trimmed,
        files
      });
    },
    [sendMessage]
  );

  const handleNewChat = useCallback(() => {
    setMessages([]);
    onNewChat?.();
  }, [onNewChat, setMessages]);

  const handleSuggestionClick = useCallback(
    async (suggestion: string) => {
      const trimmed = suggestion.trim();
      if (!trimmed) {
        return;
      }

      await sendMessage({ text: trimmed });
    },
    [sendMessage]
  );

  const renderReasoningPart = (
    reasoningPart: ReasoningUIPart,
    index: number,
    messageId: string
  ) => {
    const reasoningText = reasoningPart.text?.trim();
    if (!reasoningText) {
      return null;
    }

    if (reasoningPart.state !== "streaming") {
      return null;
    }

    return (
      <Reasoning
        className="w-full p-4"
        isStreaming={reasoningPart.state === "streaming"}
        key={`${messageId}-reasoning-${index}`}
      >
        <ReasoningTrigger />
        <ReasoningContent>{reasoningText}</ReasoningContent>
      </Reasoning>
    );
  };

  const renderCustomToolOutput = (part: UIMessage["parts"][number]) => {
    if (!isToolUIPart(part)) {
      return null;
    }

    const toolName = getToolName(part);

    if (toolName === "plot_timeseries" && isPlotTimeseriesOutput(part.output)) {
      return <PlotTimeseriesChart output={part.output} />;
    }

    return null;
  };

  const renderToolPart = (
    part: UIMessage["parts"][number],
    index: number,
    messageId: string
  ) => {
    if (!isToolUIPart(part)) {
      return null;
    }

    const approvalId = part.approval?.id ?? part.toolCallId;
    const title = part.title ?? getToolName(part);
    const toolName = part.type === "dynamic-tool" ? part.toolName : undefined;
    const hasOutput = part.output !== undefined && part.output !== "";
    const hasErrorText = Boolean(part.errorText);
    const isApprovalRequested = part.state === "approval-requested";
    const approval =
      part.approval ??
      (isApprovalRequested && approvalId ? { id: approvalId } : undefined);
    const hideConfirmation =
      part.state === "output-denied" || part.state === "output-available";
    const customOutput = renderCustomToolOutput(part);

    return (
      <div className="space-y-3" key={`${messageId}-tool-${index}`}>
        <Tool defaultOpen={isApprovalRequested}>
          <ToolHeader
            state={part.state}
            title={title}
            toolName={toolName}
            type={part.type}
          />
          <ToolContent>
            <ToolInput input={part.input} />

            <Confirmation
              approval={approval}
              state={part.state}
              className={hideConfirmation ? "hidden" : ""}
            >
              <ConfirmationRequest>
                <ConfirmationTitle>Approve tool execution?</ConfirmationTitle>
                <ConfirmationActions>
                  <ConfirmationAction
                    disabled={!approvalId}
                    onClick={() =>
                      approvalId && handleToolApproval(approvalId, false)
                    }
                    variant="outline"
                  >
                    Deny
                  </ConfirmationAction>
                  <ConfirmationAction
                    disabled={!approvalId}
                    onClick={() =>
                      approvalId && handleToolApproval(approvalId, true)
                    }
                  >
                    Approve
                  </ConfirmationAction>
                </ConfirmationActions>
              </ConfirmationRequest>
            </Confirmation>

            {(hasOutput || hasErrorText) && (
              <ToolOutput errorText={part.errorText} output={part.output} />
            )}
          </ToolContent>
        </Tool>

        {customOutput ? (
          <div className="rounded-md border bg-card/40 p-3">{customOutput}</div>
        ) : null}
      </div>
    );
  };

  const renderMessagePart = (
    part: UIMessage["parts"][number],
    index: number,
    messageId: string
  ) => {
    if (part.type === "text") {
      return (
        <MessageResponse key={`${messageId}-${index}`}>
          {part.text}
        </MessageResponse>
      );
    }

    if (part.type === "reasoning") {
      return renderReasoningPart(part, index, messageId);
    }

    return renderToolPart(part, index, messageId);
  };

  const renderMessage = (message: UIMessage) => {
    const contentParts = message.parts.filter((part) => part.type !== "file");

    return (
      <Message from={message.role} key={message.id}>
        <MessageContent>
          {contentParts.map((part, index) =>
            renderMessagePart(part, index, message.id)
          )}
        </MessageContent>
      </Message>
    );
  };

  return (
    <div className={cn("flex h-full flex-1 flex-col gap-4", className)}>
      <Card className="relative flex h-full flex-1 flex-col bg-card">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          {onNewChat ? (
            <Button
              aria-label="Start a new conversation"
              onClick={handleNewChat}
              size="sm"
              variant="outline"
            >
              <SquarePen className="mr-2 h-3.5 w-3.5" />
              New
            </Button>
          ) : null}
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          {onClose ? (
            <Button
              aria-label="Close AI chat"
              onClick={onClose}
              size="icon-sm"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <Conversation className="pt-2">
          <ConversationContent className="pt-10">
            {messages.length === 0 ? (
              <ConversationEmptyState
                description="How can I help you today?"
                title="Start a conversation"
              />
            ) : (
              messages.map((message) => renderMessage(message))
            )}

            {(status === "streaming" || status === "submitted") && (
              <Message from="assistant" key="loading">
                <MessageContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader size={16} />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t bg-background/60 p-4">
          {quickPrompts && quickPrompts.length > 0 ? (
            <div className="mb-3">
              <Suggestions className="justify-start">
                {quickPrompts.map((suggestion) => (
                  <Suggestion
                    disabled={status === "streaming" || status === "submitted"}
                    key={suggestion}
                    onClick={handleSuggestionClick}
                    suggestion={suggestion}
                  />
                ))}
              </Suggestions>
            </div>
          ) : null}

          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                aria-label="Message"
                placeholder="Ask a question or describe what you need..."
              />
            </PromptInputBody>

            <PromptInputFooter className="items-center">
              <PromptInputTools>
                <AddAttachmentButton />
              </PromptInputTools>

              <div className="flex items-center gap-2">
                {status === "streaming" ? (
                  <Button
                    aria-label="Stop response"
                    onClick={stop}
                    size="sm"
                    variant="outline"
                  >
                    Stop
                  </Button>
                ) : null}
                <PromptInputSubmit aria-label="Send message" status={status} />
              </div>
            </PromptInputFooter>
          </PromptInput>
        </div>
      </Card>
    </div>
  );
}
