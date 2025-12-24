import { AIChat } from "@flanksource-ui/components/ai/AiChat";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useState } from "react";
import { Chat, UIMessage } from "@ai-sdk/react";

export function AiChatPage() {
  const [chat] = useState(() => new Chat<UIMessage>({ id: "page" }));

  return (
    <SearchLayout title={<span className="text-base font-semibold">AI</span>}>
      <AIChat chat={chat} />
    </SearchLayout>
  );
}

export default AiChatPage;
