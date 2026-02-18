import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { Chat, UIMessage } from "@ai-sdk/react";
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

// ---------------------------------------------------------------------------
// Resize logic
// ---------------------------------------------------------------------------

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 560;

type ResizeMode = "both" | "width" | "height";

function useResizable(
  defaultWidth = DEFAULT_WIDTH,
  defaultHeight = DEFAULT_HEIGHT
) {
  const [size, setSize] = useState({
    width: defaultWidth,
    height: defaultHeight
  });

  const startResize = useCallback(
    (e: React.MouseEvent, mode: ResizeMode) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;

      const onMouseMove = (ev: MouseEvent) => {
        // Left edge drag: moving left increases width
        const dx = startX - ev.clientX;
        // Bottom edge drag: moving down increases height
        const dy = ev.clientY - startY;

        setSize({
          width:
            mode !== "height"
              ? Math.min(
                  Math.max(startWidth + dx, MIN_WIDTH),
                  window.innerWidth - 32
                )
              : startWidth,
          height:
            mode !== "width"
              ? Math.min(
                  Math.max(startHeight + dy, MIN_HEIGHT),
                  window.innerHeight - 80
                )
              : startHeight
        });
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      };

      // Prevent text selection and fix cursor during drag
      document.body.style.userSelect = "none";
      document.body.style.cursor =
        mode === "width"
          ? "ew-resize"
          : mode === "height"
            ? "ns-resize"
            : "sw-resize";

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [size.width, size.height]
  );

  return { size, startResize };
}

// ---------------------------------------------------------------------------
// Resize handles
// ---------------------------------------------------------------------------

function ResizeHandles({
  onResize
}: {
  onResize: (e: React.MouseEvent, mode: ResizeMode) => void;
}) {
  return (
    <>
      {/* Left edge handle */}
      <div
        aria-hidden
        className="group absolute bottom-3 left-0 top-3 z-20 flex w-2.5 cursor-ew-resize items-center justify-center"
        onMouseDown={(e) => onResize(e, "width")}
      >
        <div className="h-8 w-px rounded-full bg-border transition-colors group-hover:bg-muted-foreground/50" />
      </div>

      {/* Bottom edge handle */}
      <div
        aria-hidden
        className="group absolute bottom-0 left-3 right-3 z-20 flex h-2.5 cursor-ns-resize items-center justify-center"
        onMouseDown={(e) => onResize(e, "height")}
      >
        <div className="h-px w-8 rounded-full bg-border transition-colors group-hover:bg-muted-foreground/50" />
      </div>

      {/* Bottom-left corner handle */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 z-20 h-4 w-4 cursor-sw-resize"
        onMouseDown={(e) => onResize(e, "both")}
      >
        {/* Grip dots */}
        <svg
          className="absolute bottom-0.5 left-0.5 text-border"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          <circle cx="2" cy="8" r="1" />
          <circle cx="5" cy="8" r="1" />
          <circle cx="5" cy="5" r="1" />
          <circle cx="8" cy="8" r="1" />
          <circle cx="8" cy="5" r="1" />
          <circle cx="8" cy="2" r="1" />
        </svg>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// AiChatPopover
// ---------------------------------------------------------------------------

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

  const { size, startResize } = useResizable();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {trigger ? <PopoverTrigger asChild>{trigger}</PopoverTrigger> : null}
      <PopoverContent
        align="end"
        className="border-border p-0 shadow-2xl"
        style={{ width: `${size.width}px` }}
        forceMount
        side="bottom"
        sideOffset={12}
      >
        {/* Wrapper that owns the explicit height and hosts resize handles */}
        <div
          className="relative overflow-hidden rounded-[inherit]"
          style={{ height: `${size.height}px` }}
        >
          <AIChat
            key={chat.id}
            chat={chat}
            className="h-full"
            onClose={() => handleOpenChange(false)}
            onNewChat={resetChat}
            quickPrompts={quickPrompts}
          />

          <ResizeHandles onResize={startResize} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
