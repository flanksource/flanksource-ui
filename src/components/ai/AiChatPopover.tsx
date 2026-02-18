import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { Chat, UIMessage } from "@ai-sdk/react";
import { Resizable } from "re-resizable";
import { AIChat } from "@flanksource-ui/components/ai/AiChat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@flanksource-ui/components/ui/popover";

type AiChatPopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: Chat<UIMessage>;
  resetChat: () => void;
  setChatMessages: (messages: UIMessage[]) => void;
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
  const [open, setOpenState] = useState(initialOpen);
  const [chat, setChat] = useState(() => new Chat<UIMessage>({ id: chatId }));
  const [quickPrompts, setQuickPrompts] = useState<string[] | undefined>(
    undefined
  );
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
    setChat(new Chat<UIMessage>({ id: newId }));
    setQuickPrompts(undefined);
  }, [chatId, setChat]);

  const setChatMessages = useCallback(
    (messages: UIMessage[]) => {
      const newId = `${chatId}-${Date.now()}`;
      setChat(new Chat<UIMessage>({ id: newId, messages }));
    },
    [chatId, setChat]
  );

  const value = useMemo(
    () => ({
      open,
      setOpen,
      chat,
      resetChat,
      setChatMessages,
      quickPrompts,
      setQuickPrompts
    }),
    [open, setOpen, chat, resetChat, setChatMessages, quickPrompts]
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

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 560;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;

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

  const open = controlledOpen ?? context?.open ?? localOpen;
  const handleOpenChange = onOpenChange ?? context?.setOpen ?? setLocalOpen;
  const chat = context?.chat ?? localChat;
  const resetChat =
    context?.resetChat ??
    (() =>
      setLocalChat(new Chat<UIMessage>({ id: `ai-popover-${Date.now()}` })));
  const quickPrompts = context?.quickPrompts;

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
          defaultSize={{ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          maxWidth={
            typeof window !== "undefined" ? window.innerWidth - 32 : 1200
          }
          maxHeight={
            typeof window !== "undefined" ? window.innerHeight - 80 : 900
          }
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
            key={chat.id}
            chat={chat}
            className="h-full"
            onClose={() => handleOpenChange(false)}
            onNewChat={resetChat}
            quickPrompts={quickPrompts}
          />
        </Resizable>
      </PopoverContent>
    </Popover>
  );
}
