import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { Chat, UIMessage } from "@ai-sdk/react";
import { Resizable } from "re-resizable";
import { AIChat } from "@flanksource-ui/components/ai/AiChat";
import { useUser } from "@flanksource-ui/context";
import {
  deleteAIConversation,
  loadAIConversationStateSnapshot,
  setActiveAIConversationId,
  type AIConversationRecord
} from "@flanksource-ui/lib/ai-chat-history";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@flanksource-ui/components/ui/popover";

const ACTIVE_CONVERSATION_MAX_AGE_MS = 10 * 60 * 1000;

function isConversationRecent(
  conversation?: AIConversationRecord
): conversation is AIConversationRecord {
  if (!conversation) {
    return false;
  }

  return Date.now() - conversation.updatedAt <= ACTIVE_CONVERSATION_MAX_AGE_MS;
}

type AiChatPopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: Chat<UIMessage>;
  chatVersion: number;
  conversations: AIConversationRecord[];
  resetChat: () => void;
  setChatMessages: (messages: UIMessage[]) => void;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  onConversationPersisted: (
    conversationId: string,
    messages: UIMessage[]
  ) => void;
  storageScopeKey: string;
  quickPrompts?: string[];
  setQuickPrompts: (prompts?: string[]) => void;
};

const AiChatPopoverContext = createContext<AiChatPopoverContextValue | null>(
  null
);

type AiChatPopoverProviderProps = {
  children: ReactNode;
  initialOpen?: boolean;
  chatId?: string;
};

export function AiChatPopoverProvider({
  children,
  initialOpen = false,
  chatId = "ai-popover"
}: AiChatPopoverProviderProps) {
  const { user, orgSlug, backendUrl } = useUser();

  const storageScopeKey = useMemo(() => {
    const normalizedBackendUrl = backendUrl?.trim() || "default";
    const normalizedOrgSlug = orgSlug?.trim() || "default";
    const normalizedUserId = user?.id?.trim() || "anonymous";

    return `${normalizedBackendUrl}:${normalizedOrgSlug}:${normalizedUserId}`;
  }, [backendUrl, orgSlug, user?.id]);

  const [open, setOpenState] = useState(initialOpen);
  const [chat, setChat] = useState(() => new Chat<UIMessage>({ id: chatId }));
  const [chatVersion, setChatVersion] = useState(0);
  const [conversations, setConversations] = useState<AIConversationRecord[]>(
    []
  );
  const [hasHydratedChatState, setHasHydratedChatState] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState<string[] | undefined>(
    undefined
  );
  const hasUserMutatedChatRef = useRef(false);

  const replaceChat = useCallback(
    (
      nextChat: Chat<UIMessage>,
      options: { userAction?: boolean } = { userAction: true }
    ) => {
      if (options.userAction !== false) {
        hasUserMutatedChatRef.current = true;
      }

      setChat(nextChat);
      setChatVersion((version) => version + 1);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    hasUserMutatedChatRef.current = false;
    setHasHydratedChatState(false);
    setConversations([]);
    setQuickPrompts(undefined);

    const hydrateChatState = async () => {
      const { activeConversationId, conversations: storedConversations } =
        await loadAIConversationStateSnapshot(storageScopeKey);

      if (cancelled) {
        return;
      }

      setConversations(storedConversations);

      if (hasUserMutatedChatRef.current) {
        setHasHydratedChatState(true);
        return;
      }

      const storedActiveConversation =
        (activeConversationId
          ? storedConversations.find(
              (conversation) => conversation.id === activeConversationId
            )
          : undefined) ?? storedConversations[0];

      if (isConversationRecent(storedActiveConversation)) {
        const nextConversationId =
          activeConversationId ?? storedActiveConversation.id;

        replaceChat(
          new Chat<UIMessage>({
            id: nextConversationId,
            messages: storedActiveConversation.messages
          }),
          { userAction: false }
        );

        if (!activeConversationId) {
          void setActiveAIConversationId(nextConversationId, storageScopeKey);
        }
      } else {
        replaceChat(new Chat<UIMessage>({ id: `${chatId}-${Date.now()}` }), {
          userAction: false
        });
      }

      setHasHydratedChatState(true);
    };

    void hydrateChatState();

    return () => {
      cancelled = true;
    };
  }, [chatId, replaceChat, storageScopeKey]);

  useEffect(() => {
    if (!hasHydratedChatState) {
      return;
    }

    void setActiveAIConversationId(chat.id, storageScopeKey);
  }, [chat.id, hasHydratedChatState, storageScopeKey]);

  const setOpen = useCallback(
    (open: boolean) => {
      setOpenState(open);
      if (!open) {
        setQuickPrompts(undefined);
      }
    },
    [setOpenState, setQuickPrompts]
  );

  const resetChat = useCallback(() => {
    const newId = `${chatId}-${Date.now()}`;
    replaceChat(new Chat<UIMessage>({ id: newId }));
    setQuickPrompts(undefined);
  }, [chatId, replaceChat]);

  const setChatMessages = useCallback(
    (messages: UIMessage[]) => {
      const newId = `${chatId}-${Date.now()}`;
      replaceChat(new Chat<UIMessage>({ id: newId, messages }));
    },
    [chatId, replaceChat]
  );

  const selectConversation = useCallback(
    (conversationId: string) => {
      const normalizedConversationId = conversationId.trim();
      if (!normalizedConversationId) {
        return;
      }

      const selectedConversation = conversations.find(
        (conversation) => conversation.id === normalizedConversationId
      );

      if (!selectedConversation) {
        return;
      }

      replaceChat(
        new Chat<UIMessage>({
          id: selectedConversation.id,
          messages: selectedConversation.messages
        })
      );
      setQuickPrompts(undefined);
    },
    [conversations, replaceChat, setQuickPrompts]
  );

  const deleteConversation = useCallback(
    (conversationId: string) => {
      const normalizedConversationId = conversationId.trim();

      if (!normalizedConversationId) {
        return;
      }

      const remainingConversations = conversations.filter(
        (conversation) => conversation.id !== normalizedConversationId
      );

      setConversations(remainingConversations);
      void deleteAIConversation(normalizedConversationId, storageScopeKey);

      if (chat.id === normalizedConversationId) {
        const fallbackConversation = remainingConversations[0];

        if (fallbackConversation) {
          replaceChat(
            new Chat<UIMessage>({
              id: fallbackConversation.id,
              messages: fallbackConversation.messages
            })
          );
        } else {
          replaceChat(new Chat<UIMessage>({ id: `${chatId}-${Date.now()}` }));
        }

        setQuickPrompts(undefined);
      }
    },
    [
      chat.id,
      chatId,
      conversations,
      replaceChat,
      setQuickPrompts,
      storageScopeKey
    ]
  );

  const onConversationPersisted = useCallback(
    (conversationId: string, messages: UIMessage[]) => {
      const normalizedConversationId = conversationId.trim();

      if (!normalizedConversationId || messages.length === 0) {
        return;
      }

      const now = Date.now();

      setConversations((previousConversations) => {
        const existingConversation = previousConversations.find(
          (conversation) => conversation.id === normalizedConversationId
        );

        const nextConversation: AIConversationRecord = {
          id: normalizedConversationId,
          messages,
          createdAt: existingConversation?.createdAt ?? now,
          updatedAt: now
        };

        return [
          nextConversation,
          ...previousConversations.filter(
            (conversation) => conversation.id !== normalizedConversationId
          )
        ];
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      open,
      setOpen,
      chat,
      chatVersion,
      conversations,
      resetChat,
      setChatMessages,
      selectConversation,
      deleteConversation,
      onConversationPersisted,
      storageScopeKey,
      quickPrompts,
      setQuickPrompts
    }),
    [
      open,
      setOpen,
      chat,
      chatVersion,
      conversations,
      resetChat,
      setChatMessages,
      selectConversation,
      deleteConversation,
      onConversationPersisted,
      storageScopeKey,
      quickPrompts
    ]
  );

  return (
    <AiChatPopoverContext.Provider value={value}>
      {children}
    </AiChatPopoverContext.Provider>
  );
}

export function useAiChatPopover() {
  const context = useContext(AiChatPopoverContext);

  if (!context) {
    throw new Error(
      "useAiChatPopover must be used within AiChatPopoverProvider"
    );
  }

  return context;
}

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const FALLBACK_WIDTH = 768;
const FALLBACK_HEIGHT = 672;
const DEFAULT_WIDTH_RATIO = 0.5;
const DEFAULT_HEIGHT_RATIO = 0.7;
const VIEWPORT_WIDTH_MARGIN = 32;
const VIEWPORT_HEIGHT_MARGIN = 80;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getMaxPopoverWidth() {
  if (typeof window === "undefined") {
    return 1200;
  }

  return Math.max(MIN_WIDTH, window.innerWidth - VIEWPORT_WIDTH_MARGIN);
}

function getMaxPopoverHeight() {
  if (typeof window === "undefined") {
    return 900;
  }

  return Math.max(MIN_HEIGHT, window.innerHeight - VIEWPORT_HEIGHT_MARGIN);
}

function getDefaultPopoverSize() {
  if (typeof window === "undefined") {
    return {
      width: FALLBACK_WIDTH,
      height: FALLBACK_HEIGHT
    };
  }

  return {
    width: clamp(
      Math.round(window.innerWidth * DEFAULT_WIDTH_RATIO),
      MIN_WIDTH,
      getMaxPopoverWidth()
    ),
    height: clamp(
      Math.round(window.innerHeight * DEFAULT_HEIGHT_RATIO),
      MIN_HEIGHT,
      getMaxPopoverHeight()
    )
  };
}

type AiChatPopoverProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
};

export function AiChatPopover({
  open: controlledOpen,
  onOpenChange,
  trigger
}: AiChatPopoverProps) {
  const context = useContext(AiChatPopoverContext);
  const [localOpen, setLocalOpen] = useState(false);
  const [localChat, setLocalChat] = useState(
    () => new Chat<UIMessage>({ id: "ai-popover-local" })
  );

  // Size state lives here in the parent so it survives popover close/reopen
  const [size, setSize] = useState(() => getDefaultPopoverSize());

  useEffect(() => {
    setSize((previousSize) => {
      const defaultSize = getDefaultPopoverSize();

      if (
        previousSize.width === defaultSize.width &&
        previousSize.height === defaultSize.height
      ) {
        return previousSize;
      }

      return defaultSize;
    });
  }, []);

  const open = controlledOpen ?? context?.open ?? localOpen;
  const handleOpenChange = onOpenChange ?? context?.setOpen ?? setLocalOpen;
  const chat = context?.chat ?? localChat;
  const chatVersion = context?.chatVersion ?? 0;
  const resetChat =
    context?.resetChat ??
    (() =>
      setLocalChat(new Chat<UIMessage>({ id: `ai-popover-${Date.now()}` })));
  const quickPrompts = context?.quickPrompts;
  const conversationHistory = context?.conversations;
  const selectConversation = context?.selectConversation;
  const deleteConversation = context?.deleteConversation;
  const onConversationPersisted = context?.onConversationPersisted;
  const storageScopeKey = context?.storageScopeKey;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {trigger ? <PopoverTrigger asChild>{trigger}</PopoverTrigger> : null}
      <PopoverContent
        align="end"
        className="w-auto border-border p-0 shadow-2xl"
        forceMount
        side="bottom"
        sideOffset={12}
      >
        <Resizable
          size={size}
          onResizeStop={(_e, _direction, _ref, delta) => {
            setSize((prev) => ({
              width: prev.width + delta.width,
              height: prev.height + delta.height
            }));
          }}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          maxWidth={getMaxPopoverWidth()}
          maxHeight={getMaxPopoverHeight()}
          // Popover is right-anchored, so only allow resizing leftward and downward
          enable={{
            top: false,
            right: false,
            bottom: true,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: true,
            topLeft: false
          }}
          className="overflow-hidden rounded-[inherit]"
        >
          <AIChat
            key={`${chat.id}-${chatVersion}`}
            chat={chat}
            className="h-full"
            activeConversationId={chat.id}
            conversationHistory={conversationHistory}
            onClose={() => handleOpenChange(false)}
            onConversationPersisted={onConversationPersisted}
            onDeleteConversation={deleteConversation}
            onNewChat={resetChat}
            onSelectConversation={selectConversation}
            quickPrompts={quickPrompts}
            storageScopeKey={storageScopeKey}
          />
        </Resizable>
      </PopoverContent>
    </Popover>
  );
}
