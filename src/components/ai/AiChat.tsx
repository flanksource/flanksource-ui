import { Chat, useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton
} from "@flanksource-ui/components/ai-elements/conversation";
import { Check, History, SquarePen, Trash2, X } from "lucide-react";
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
  ToolInput
} from "@flanksource-ui/components/ai-elements/tool";
import { ToolOutput } from "@flanksource-ui/components/ai/ToolOutput";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@flanksource-ui/components/ui/dropdown-menu";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@flanksource-ui/components/ui/chart";
import { formatTick, parseTimestamp } from "@flanksource-ui/lib/timeseries";
import {
  saveAIConversation,
  type AIConversationRecord
} from "@flanksource-ui/lib/ai-chat-history";
import { cn } from "@flanksource-ui/lib/utils";
import type { FileUIPart, ReasoningUIPart, UIMessage } from "ai";
import { getToolName, isToolUIPart } from "ai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import { CartesianGrid, Line, ComposedChart, XAxis, YAxis } from "recharts";

type TimeseriesPoint = { timestamp: string; value: number };
type PlotTimeseriesOutput = {
  kind: "plot_timeseries";
  timeseries: TimeseriesPoint[];
  title?: string;
};

const HISTORY_PREVIEW_MAX_LENGTH = 72;

function getConversationPreview(messages: UIMessage[]): string {
  for (const message of messages) {
    if (message.role !== "user") {
      continue;
    }

    for (const part of message.parts) {
      if (part.type !== "text") {
        continue;
      }

      const normalizedText = part.text.replace(/\s+/g, " ").trim();

      if (!normalizedText) {
        continue;
      }

      if (normalizedText.length <= HISTORY_PREVIEW_MAX_LENGTH) {
        return normalizedText;
      }

      return `${normalizedText.slice(0, HISTORY_PREVIEW_MAX_LENGTH - 1)}…`;
    }
  }

  return "Untitled conversation";
}

function formatConversationTime(updatedAt: number): string {
  return new Date(updatedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

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
  const chartConfig = useMemo<ChartConfig>(() => {
    return {
      value: {
        label: output.title ?? "Value",
        color: "#2563eb"
      }
    };
  }, [output.title]);

  const data = useMemo(() => {
    return output.timeseries
      .map((point, index) => {
        const { numericValue, label } = parseTimestamp(point.timestamp, index);
        return {
          __timestamp: numericValue,
          __label: label,
          value: point.value
        };
      })
      .filter((point) => Number.isFinite(point.__timestamp))
      .sort((a, b) => a.__timestamp - b.__timestamp);
  }, [output.timeseries]);

  const timeRange = useMemo(() => {
    if (!data.length) return null;
    const timestamps = data
      .map((point) => point.__timestamp)
      .filter((value) => Number.isFinite(value));
    if (!timestamps.length) return null;
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
    return { min, max, span: max - min };
  }, [data]);

  return (
    <div className="space-y-2 p-4">
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {output.title ?? "Timeseries Chart"}
      </h4>
      <ChartContainer
        config={chartConfig}
        className="h-64 w-full rounded-lg border border-border/60 bg-background/50 px-2 py-3 sm:px-3"
      >
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="__timestamp"
            type="number"
            scale="time"
            domain={["auto", "auto"]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={20}
            tickFormatter={(value) => formatTick(value, timeRange)}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={{ strokeDasharray: "4 4" }}
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit"
                  });
                }}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            name={output.title ?? "Value"}
            stroke="var(--color-value)"
            strokeWidth={1}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
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
  activeConversationId?: string;
  conversationHistory?: AIConversationRecord[];
  onSelectConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
  onConversationPersisted?: (
    conversationId: string,
    messages: UIMessage[]
  ) => void;
  storageScopeKey?: string;
};

export function AIChat({
  chat,
  className,
  id,
  onClose,
  onNewChat,
  quickPrompts,
  activeConversationId,
  conversationHistory,
  onSelectConversation,
  onDeleteConversation,
  onConversationPersisted,
  storageScopeKey
}: AIChatProps) {
  const {
    messages,
    sendMessage,
    stop,
    status,
    addToolApprovalResponse,
    setMessages,
    error,
    clearError
  } = useChat({
    chat,
    id
  });

  useEffect(() => {
    if (!chat.id || messages.length === 0) {
      return;
    }

    void saveAIConversation(chat.id, messages, storageScopeKey);
    onConversationPersisted?.(chat.id, messages);
  }, [chat.id, messages, onConversationPersisted, storageScopeKey]);

  // Auto-send when chat mounts with a pre-seeded user message (e.g. from setChatMessages).
  const hasSentOnMount = useRef(false);
  useEffect(() => {
    if (
      !hasSentOnMount.current &&
      messages.length > 0 &&
      messages[messages.length - 1].role === "user" &&
      status === "ready"
    ) {
      hasSentOnMount.current = true;
      sendMessage();
    }
  }, [messages, status, sendMessage]);

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

      if (error) {
        clearError();
      }

      await sendMessage({
        text: trimmed,
        files
      });
    },
    [clearError, error, sendMessage]
  );

  const handleNewChat = useCallback(() => {
    if (onNewChat) {
      onNewChat();
    } else {
      setMessages([]);
    }

    if (error) {
      clearError();
    }
  }, [clearError, error, onNewChat, setMessages]);

  const handleSuggestionClick = useCallback(
    async (suggestion: string) => {
      const trimmed = suggestion.trim();
      if (!trimmed) {
        return;
      }

      if (error) {
        clearError();
      }

      await sendMessage({ text: trimmed });
    },
    [clearError, error, sendMessage]
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

  const formatToolArgsSummary = (input: unknown, maxLen = 90): string => {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return "";
    }

    const serialize = (val: unknown): string => {
      if (Array.isArray(val)) return val.join(",");
      if (val && typeof val === "object" && !Array.isArray(val)) {
        const entries = Object.entries(val as Record<string, unknown>)
          .filter(([, v]) => v !== null && v !== undefined && v !== "")
          .map(([k, v]) => `${k}: ${String(v)}`);
        return entries.join(",");
      }
      return String(val);
    };

    const result = Object.entries(input as Record<string, unknown>)
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([k, v]) => `${k}: ${serialize(v)}`)
      .join(" ");

    if (!result) return "";
    return result.length > maxLen
      ? result.substring(0, maxLen - 1) + "…"
      : result;
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
    const baseName = part.title ?? getToolName(part);
    const argsSummary = formatToolArgsSummary(part.input);
    const title = argsSummary ? `${baseName} (${argsSummary})` : baseName;
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

    const configId =
      part.input && typeof part.input === "object" && !Array.isArray(part.input)
        ? ((part.input as Record<string, unknown>).config_id as
            | string
            | undefined)
        : undefined;

    return (
      <div className="space-y-3" key={`${messageId}-tool-${index}`}>
        <Tool defaultOpen={isApprovalRequested}>
          <ToolHeader
            state={part.state}
            title={title}
            toolName={toolName}
            type={part.type}
          />
          {typeof configId === "string" && configId && (
            <div className="flex items-center gap-2 border-t px-3 py-1.5 text-sm text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wide">
                Config:
              </span>
              <ConfigLink configId={configId} />
            </div>
          )}
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

  const visibleConversationHistory = useMemo(() => {
    return (conversationHistory ?? []).slice(0, 20);
  }, [conversationHistory]);

  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : String(error)
    : "";

  return (
    <div className={cn("flex h-full flex-1 flex-col gap-4", className)}>
      <Card className="relative flex h-full flex-1 flex-col bg-card">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          {onSelectConversation ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="View conversation history"
                  size="sm"
                  variant="outline"
                >
                  <History className="mr-2 h-3.5 w-3.5" />
                  History
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                <DropdownMenuLabel>Conversation History</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {visibleConversationHistory.length > 0 ? (
                  visibleConversationHistory.map((conversation) => {
                    const isActive = activeConversationId === conversation.id;

                    return (
                      <DropdownMenuItem
                        className="group"
                        key={conversation.id}
                        onSelect={() => onSelectConversation(conversation.id)}
                      >
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">
                            {getConversationPreview(conversation.messages)}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {formatConversationTime(conversation.updatedAt)}
                          </span>
                        </div>
                        <div className="ml-2 flex items-center gap-1">
                          {isActive ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : null}
                          {onDeleteConversation ? (
                            <button
                              type="button"
                              aria-label="Delete conversation"
                              className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100 group-focus:opacity-100"
                              title="Delete conversation"
                              onPointerDown={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                onDeleteConversation(conversation.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <DropdownMenuItem disabled>
                    No saved conversations yet
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

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

            {errorMessage ? (
              <Message from="assistant" key="error">
                <MessageContent className="w-full">
                  <div className="space-y-3">
                    <ErrorViewer error={error} />
                    <div className="flex justify-end">
                      <Button onClick={clearError} size="sm" variant="outline">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </MessageContent>
              </Message>
            ) : null}

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

            <PromptInputFooter className="items-center justify-end">
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
