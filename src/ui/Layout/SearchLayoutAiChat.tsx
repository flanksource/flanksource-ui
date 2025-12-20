import { ReactNode, useEffect } from "react";
import { Sparkles } from "lucide-react";
import {
  AiChatPopover,
  AiChatPopoverProvider,
  useAiChatPopover
} from "../../components/ai/AiChatPopover";

function AiChatPopoverWithTrigger({
  shouldAutoOpen
}: {
  shouldAutoOpen?: boolean;
}) {
  const { open, setOpen } = useAiChatPopover();

  useEffect(() => {
    if (shouldAutoOpen && !open) {
      setOpen(true);
    }
  }, [shouldAutoOpen, open, setOpen]);

  return (
    <AiChatPopover
      trigger={
        <button
          type="button"
          className="flex h-full w-8 items-center justify-center text-gray-400 hover:text-gray-500"
          title="AI Chat"
          aria-expanded={open}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          <span className="sr-only">AI Chat</span>
        </button>
      }
    />
  );
}

export function AiChatSection({
  children,
  shouldAutoOpen
}: {
  children?: ReactNode;
  shouldAutoOpen?: boolean;
}) {
  return (
    <AiChatPopoverProvider>
      {children}
      {!children && (
        <AiChatPopoverWithTrigger shouldAutoOpen={shouldAutoOpen} />
      )}
    </AiChatPopoverProvider>
  );
}

export function AiChatButton({ shouldAutoOpen }: { shouldAutoOpen?: boolean }) {
  return <AiChatPopoverWithTrigger shouldAutoOpen={shouldAutoOpen} />;
}
